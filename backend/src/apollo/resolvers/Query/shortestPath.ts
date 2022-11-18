import type { Context } from "@src/server/context";
import type { User } from "@src/typings";

interface QueryShortestPathArgs {
  input: {
    startUsername: string;
    endUsername: string;
  };
}

export const shortestPath = async (
  _root: unknown,
  args: QueryShortestPathArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;

  const res = await neo4j.run(
    "MATCH (A:User {username: $startUsernameParam}), (B:User {username: $endUsernameParam}), \
    p = shortestPath((A)-[r:Follows*]->(B)) \
    RETURN B, p;",
    {
      startUsernameParam: args.input.startUsername,
      endUsernameParam: args.input.endUsername,
    }
  );
  if (!res.records.length) return [];
  const path = res.records[0].get("p").segments.map((segment: any) => {
    const u: User = segment.start.properties;
    return {
      name: u.name,
      tweetCount: u.tweetCount ? u.tweetCount.toInt() : undefined,
      followingCount: u.followingCount ? u.followingCount.toInt() : undefined,
      followersCount: u.followersCount ? u.followersCount.toInt() : undefined,
      createdAt: u.createdAt ? new Date(u?.createdAt).toString() : undefined,
      username: u.username,
    };
  });

  // adding terminal node
  const endUser: User = res.records[0].get("B").properties;
  path.push({
    name: endUser.name,
    tweetCount: endUser.tweetCount ? endUser.tweetCount.toInt() : undefined,
    followingCount: endUser.followingCount ? endUser.followingCount.toInt() : undefined,
    followersCount: endUser.followersCount ? endUser.followersCount.toInt() : undefined,
    createdAt: endUser.createdAt ? new Date(endUser?.createdAt).toString() : undefined,
    username: endUser.username,
  });

  return path;
};
