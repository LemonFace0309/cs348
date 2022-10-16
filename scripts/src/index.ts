import fs from 'fs';

import csv from 'csv-parser';
import * as dotenv from 'dotenv';
import {TwitterApi} from 'twitter-api-v2';

import type {User} from './types';

dotenv.config();

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.TWITTER_API_BEARER as string);

// Tell typescript it's a readonly app
const readOnlyClient = twitterClient.readOnly;

function readCSV() {
  const results: User[] = [];
  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      console.log(results);
    });
}

async function main() {
  // Play with the built in methods
  const user = await readOnlyClient.v2.userByUsername('CharlesLiu9');
  console.log(user);
  readCSV();
}

main();
