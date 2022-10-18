import * as dotenv from 'dotenv';
import {TwitterApi} from 'twitter-api-v2';

import {initDb, populateDb, closeDb} from './db';
import {getTwitterDataAndUpdateDb} from './twitter';

dotenv.config();

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.TWITTER_API_BEARER as string);

// Tell typescript it's a readonly app
const readOnlyClient = twitterClient.readOnly;

async function main() {
  const driver = await initDb();
  await populateDb(driver);
  await getTwitterDataAndUpdateDb(driver);
  await closeDb(driver);
}

main();
