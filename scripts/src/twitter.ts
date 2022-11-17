import * as dotenv from 'dotenv';
import {Integer, int, Session} from 'neo4j-driver';
import {chunk} from 'lodash';
import {
  FollowersV2ParamsWithoutPaginator,
  TwitterApi,
  TwitterApiReadOnly,
} from 'twitter-api-v2';

import {outputProgress, sleep} from './utils';

dotenv.config();

export async function getTwitterDataAndUpdateDb(session: Session) {
  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(
    process.env.TWITTER_API_BEARER as string
  );

  // Tell typescript it's a readonly app
  const client = twitterClient.readOnly;

  await fetchUsers(client, session);

  await fetchTweets(client, session);

  await fetchFollowing(client, session);
}

async function fetchUsers(client: TwitterApiReadOnly, session: Session) {
  console.log('Fetching users:');
  try {
    const res = await session.run('MATCH (u:User) RETURN u;');

    const usernames: string[] = res.records.map(
      record => record.get('u').properties.username
    );

    // Getting additional data for each user
    // Twitter rate limits - load slowly & batch
    const batchUsernames = chunk(usernames, 100);
    for (const [i, usernames] of batchUsernames.entries()) {
      const res = await client.v2.usersByUsernames(usernames, {
        'user.fields': 'public_metrics,created_at',
        expansions: 'pinned_tweet_id',
      });

      // Data looks like this
      // {
      //       "username": "katyperry",
      //       "name": "KATY PERRY",
      //       "created_at": "2009-02-20T23:45:56.000Z",
      //       "public_metrics": {
      //           "followers_count": 108909855,
      //           "following_count": 244,
      //           "tweet_count": 11744,
      //           "listed_count": 127583
      //       },
      //       "id": "21447363",
      //       "pinned_tweet_id": "1392466469636612097"
      //   },
      const users = res.data;
      // update user data to db
      for (const user of users) {
        const res = await session.run(
          'MATCH (u:User {username: $usernameParam}) \
          SET u += { twitterId: $twitterIdParam, name: $name, followersCount: $followersCountParam, followingCount: $followingCountParam, tweetCount: $tweetCountParam, createdAt: $createdAtParam} \
          RETURN u',
          {
            usernameParam: user.username,
            twitterIdParam: int(+user.id),
            name: user.name,
            followersCountParam: int(
              +(user.public_metrics?.followers_count ?? 0)
            ),
            followingCountParam: int(
              +(user.public_metrics?.following_count ?? 0)
            ),
            tweetCountParam: int(+(user.public_metrics?.tweet_count ?? 0)),
            createdAtParam: new Date(user.created_at ?? '0001').getTime(), // stores as ms, RETURN date({ epochMillis: $startsAt }) to convert to Date in cypher
          }
        );
        // console.log(res.records.map(record => record.get('u').properties));
      }
      outputProgress(
        i * 100 + usernames.length,
        i === batchUsernames.length - 1
      );
      if (i !== batchUsernames.length - 1) await sleep(300000); // 5 minutes
    }
  } catch (err) {
    console.log('Unabled to get all users:', err);
  }
}

async function fetchTweets(client: TwitterApiReadOnly, session: Session) {
  console.log('Fetching tweets:');
  let curName = '';
  try {
    const res = await session.run('MATCH (u:User) RETURN u;');

    const accounts: {name: string; twitterId: Integer | undefined}[] =
      res.records.map(record => ({
        name: record.get('u').properties.name,
        twitterId: record.get('u').properties.twitterId,
      }));

    // calling api
    for (const [i, account] of accounts.entries()) {
      if (!account.twitterId) break;
      curName = account.name;

      const timeline = await client.v2.userTimeline(
        account.twitterId.toString(),
        {
          'tweet.fields': ['author_id', 'created_at', 'id', 'text'],
          'media.fields': ['alt_text'],
        }
      );

      // adding most recent 3 tweets to db
      let count = 0;
      for await (const tweet of timeline) {
        if (tweet.author_id === account.twitterId.toString()) {
          const res = await session.run(
            'CREATE (t:Tweet {tweetId: $tweetIdParam, text: $textParam, createdAt: $createdAtParam}) \
            WITH t \
            MATCH (u:User {twitterId: $twitterIdParam}) \
            CREATE (u)-[r:Author]->(t);',
            {
              tweetIdParam: int(+tweet.id),
              textParam: tweet.text,
              twitterIdParam: int(+tweet.author_id),
              createdAtParam: new Date(tweet.created_at ?? '0001').getTime(),
            }
          );
        }
        count++;
        if (count === 3) break;
      }

      outputProgress(i + 1, i === accounts.length - 1, curName);
      if (i !== accounts.length - 1) await sleep(2100); // 2.1 seconds
    }
  } catch (err) {
    console.log(`Failed to get tweets for ${curName}:`, err);
  }
}

async function fetchFollowing(client: TwitterApiReadOnly, session: Session) {
  console.log('Fetching follows:');
  let curName = '';
  try {
    const res = await session.run('MATCH (u:User) RETURN u;');

    const accounts: {name: string; twitterId: Integer | undefined}[] =
      res.records.map(record => ({
        name: record.get('u').properties.name,
        twitterId: record.get('u').properties.twitterId,
      }));

    // calling api
    for (const [i, account] of accounts.entries()) {
      if (!account.twitterId) break;
      // eslint-disable-next-line no-constant-condition
      curName = account.name;

      let paginationToken: string | undefined = '';
      let followingTwitterIds: string[] = [];
      let paginationCount = 1;
      while (typeof paginationToken !== 'undefined' || paginationCount === 3) {
        const params: Partial<FollowersV2ParamsWithoutPaginator> = {
          'user.fields': ['id', 'username'],
          max_results: 1000,
        };
        if (paginationToken) params.pagination_token = paginationToken;

        const following = await client.v2.following(
          account.twitterId.toString(),
          params
        );

        paginationToken = following.meta.next_token;
        followingTwitterIds = followingTwitterIds.concat(
          following.data.map(user => user.id)
        );
        paginationCount++;
        await sleep(60010); // 1 minute
      }

      // adding follows relation to db
      const res = await session.run(
        'MATCH (u2:User) \
        WHERE u2.twitterId in $followingTwitterIdsParam \
        MATCH (u1:User {twitterId: $twitterIdParam}) \
        WITH u1, u2 \
        CREATE (u1)-[r:Follows]->(u2);',
        {
          twitterIdParam: account.twitterId,
          followingTwitterIdsParam: followingTwitterIds.map(id => int(+id)),
        }
      );

      outputProgress(
        i + 1,
        i === accounts.length - 1,
        `${curName} follows ${followingTwitterIds.length} users`
      );
    }
  } catch (err) {
    console.log(`Failed to get follows for ${curName}:`, err);
  }
}
