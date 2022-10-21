import * as dotenv from 'dotenv';
import neo4j, {Driver} from 'neo4j-driver';

dotenv.config();

export async function initDb() {
  return neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME as string,
      process.env.NEO4J_PASSWORD as string
    )
  );
}

export async function populateDb(driver: Driver) {
  const session = driver.session({
    database: process.env.NEO4J_DB as string,
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    const res = await session.run(
      "LOAD CSV WITH HEADERS FROM 'file:///production-users.csv' AS line \
      CREATE (:User {username: line.twitter, name: line.name, domain: line.domain});"
    );
  } catch (err) {
    console.log(err);
  }
}

export async function closeDb(driver: Driver) {
  await driver.close();
}
