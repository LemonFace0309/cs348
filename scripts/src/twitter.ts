import * as dotenv from 'dotenv';
import {Session} from 'neo4j-driver';
import {chunk} from 'lodash';
import {TwitterApi} from 'twitter-api-v2';

import {outputProgress, sleep} from './utils';

dotenv.config();

export async function getTwitterDataAndUpdateDb(session: Session) {
  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(
    process.env.TWITTER_API_BEARER as string
  );

  // Tell typescript it's a readonly app
  const client = twitterClient.readOnly;

  // fetching users
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
          SET u += { twitter_id: $twitterIdParam, name: $name, followers_count: $followersCountParam, following_count: $followingCountParam, tweet_count: $tweetCountParam, created_at: $createdAtParam} \
          RETURN u',
          {
            usernameParam: user.username,
            twitterIdParam: +user.id,
            name: user.name,
            followersCountParam: +(user.public_metrics?.followers_count ?? 0),
            followingCountParam: +(user.public_metrics?.following_count ?? 0),
            tweetCountParam: +(user.public_metrics?.tweet_count ?? 0),
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

  // fetching tweets
  let curName = '';
  try {
    const res = await session.run('MATCH (u:User) RETURN u;');

    const accounts: {name: string; twitter_id: string | undefined}[] =
      res.records.map(record => ({
        name: record.get('u').properties.name,
        twitter_id: record.get('u').properties.twitter_id,
      }));

    // calling api
    for (const [i, account] of accounts.entries()) {
      if (!account.twitter_id) break;
      curName = account.name;

      const timeline = await client.v2.userTimeline(
        account.twitter_id.toString(),
        {
          'tweet.fields': ['author_id', 'created_at', 'id', 'text'],
          'media.fields': ['alt_text'],
        }
      );

      // adding most recent 3 tweets to db
      let count = 0;
      for await (const tweet of timeline) {
        if (tweet.author_id === account.twitter_id.toString()) {
          const res = await session.run(
            'CREATE (t:Tweet {tweet_id: $tweetIdParam, text: $textParam, createdAt: $createdAtParam}) \
            WITH t \
            MATCH (u:User {twitter_id: $twitterIdParam}) \
            CREATE (u)-[r:Author]->(t);',
            {
              tweetIdParam: +tweet.id,
              textParam: tweet.text,
              twitterIdParam: +tweet.author_id,
              createdAtParam: new Date(tweet.created_at ?? '0001').getTime(),
            }
          );
        }
        count++;
        if (count === 2) break;
      }

      outputProgress(i + 1, i === accounts.length - 1, curName);
      if (i !== accounts.length - 1) await sleep(3100); // 3.1 seconds
    }
  } catch (err) {
    console.log(`Failed to get tweets for ${curName}:`, err);
  }
}
