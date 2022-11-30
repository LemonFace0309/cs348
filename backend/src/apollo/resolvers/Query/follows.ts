import type { Context } from "@src/server/context";
import type { User } from "@src/typings";
import { Console } from "console";

interface QueryFollowsArgs {
  username: string;
}

export const follows = async (
  _root: unknown,
  args: QueryFollowsArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;

  const res = await neo4j.run(
    "MATCH (u1:User {username: $usernameParam})<-[r:Follows]-(u2:User) \
    RETURN u2;",
    {
      usernameParam: args.username,
    }
  );
  const users = res.records.map((record) => {
    const u: User = record.get("u2").properties;
    return {
      name: u.name,
      tweetCount: u.tweetCount ? u.tweetCount.toInt() : undefined,
      followingCount: u.followingCount ? u.followingCount.toInt() : undefined,
      followersCount: u.followersCount ? u.followersCount.toInt() : undefined,
      createdAt: u.createdAt ? new Date(u?.createdAt).toString() : undefined,
      username: u.username,
    };
  });
  return users;
};
