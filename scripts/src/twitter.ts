import * as dotenv from 'dotenv';
import neo4j, {Driver} from 'neo4j-driver';
import {chunk} from 'lodash';
import {TwitterApi} from 'twitter-api-v2';

import {sleep} from './utils';

dotenv.config();

export async function getTwitterDataAndUpdateDb(driver: Driver) {
  const session = driver.session({
    database: process.env.NEO4J_DB as string,
    defaultAccessMode: neo4j.session.WRITE,
  });

  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(
    process.env.TWITTER_API_BEARER as string
  );

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  try {
    const res = await session.run('MATCH (u:User) RETURN u;');

    const usernames: string[] = res.records.map(
      record => record.get('u').properties.username
    );

    // Getting additional data for each user
    // Twitter rate limits - load slowly & batch
    const batchUsernames = chunk(usernames, 100);
    for (const batchUsername of batchUsernames) {
      const res = await readOnlyClient.v2.usersByUsernames(batchUsername, {
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
          SET u += { followers_count: $followersCountParam, following_count: $followingCountParam, tweet_count: $tweetCountParam, created_at: $createdAtParam} \
          RETURN u',
          {
            usernameParam: user.username,
            followersCountParam: +(user.public_metrics?.followers_count ?? 0),
            followingCountParam: +(user.public_metrics?.following_count ?? 0),
            tweetCountParam: +(user.public_metrics?.tweet_count ?? 0),
            createdAtParam: +new Date(user.created_at ?? '0001').getFullYear(),
          }
        );
        // console.log(res.records.map(record => record.get('u').properties));
      }
      await sleep(300000); // 5 minutes
    }
  } catch (err) {
    console.log(err);
  }
}
