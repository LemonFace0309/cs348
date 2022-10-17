import fs from 'fs';

import csv from 'csv-parser';
import * as dotenv from 'dotenv';
import neo4j, {Driver} from 'neo4j-driver';
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

async function initDb() {
  return neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'development')
  );
}

async function populateDb(driver: Driver) {
  const session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE,
  });
  console.log(session);

  // Run a Cypher statement, reading the result in a streaming manner as records arrive:
  session
    .run('MERGE (alice:Person {name : $nameParam}) RETURN alice.name AS name', {
      nameParam: 'Alice',
    })
    .subscribe({
      onKeys: keys => {
        console.log(keys);
      },
      onNext: record => {
        console.log(record.get('name'));
      },
      onCompleted: () => {
        session.close(); // returns a Promise
      },
      onError: error => {
        console.log(error);
      },
    });
}

async function closeDb(driver: Driver) {
  await driver.close();
}

async function main() {
  // Play with the built in methods
  const user = await readOnlyClient.v2.userByUsername('CharlesLiu9');
  // readCSV();
  const driver = await initDb();
  console.log(driver);
  await populateDb(driver);
  await closeDb(driver);
}

main();
