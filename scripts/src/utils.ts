import fs from 'fs';

import csv from 'csv-parser';

import type {CsvUser} from './types';

export function readCSV() {
  const results: CsvUser[] = [];
  fs.createReadStream('production-users.csv')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      console.log(results);
    });
}

export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
