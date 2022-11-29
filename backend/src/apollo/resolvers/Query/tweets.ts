import type { Context } from "@src/server/context";
import type { Tweet } from "@src/typings";

interface QueryTweetArgs {
  username: string;
}

export const tweets = async (
  _root: unknown,
  args: QueryTweetArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;
  const res = await neo4j.run(
    "MATCH (u:User {username: $usernameParam})-[:Author]->(t:Tweet) \
    RETURN t;",
    {
      usernameParam: args.username,
    }
  );
  const tweets = res.records.map((record) => {
    const u: Tweet = record.get("t").properties;
    return {
      tweetId: u.tweetId.toNumber(),
      text: u.text,
      createdAt: new Date(u.createdAt).toString(),
    };
  });
  return tweets;
};
