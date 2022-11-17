import * as dotenv from 'dotenv';
import neo4j, {Driver, Session} from 'neo4j-driver';

dotenv.config();

export async function initDb() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME as string,
      process.env.NEO4J_PASSWORD as string
    )
  );
  const session = driver.session({
    database: process.env.NEO4J_DB as string,
    defaultAccessMode: neo4j.session.WRITE,
  });

  return {driver, session};
}

export async function populateDb(session: Session) {
  try {
    const res = await session.run(
      "LOAD CSV WITH HEADERS FROM 'file:///production-users-small.csv' AS line \
      CREATE (:User {username: line.twitter, name: line.name});"
    );
  } catch (err) {
    console.log(err);
  }
}

export async function closeDb(driver: Driver) {
  await driver.close();
}
