import * as dotenv from 'dotenv';
import {TwitterApi} from 'twitter-api-v2';

dotenv.config();

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.TWITTER_API_BEARER as string);

// Tell typescript it's a readonly app
const readOnlyClient = twitterClient.readOnly;

async function main() {
  // Play with the built in methods
  const user = await readOnlyClient.v2.userByUsername('CharlesLiu9');
  console.log(user);
}

main();
