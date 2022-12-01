import type { Context } from "@src/server/context";
import type { User } from "@src/typings";

interface MutateCreateUserArgs {
  username: string;
}

export const createUser = async (
  _root: unknown,
  args: MutateCreateUserArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;
  const res = await neo4j.run(
    "MATCH (u:User {username: $usernameParam}) \
    RETURN u;",
    {
      usernameParam: args.username,
    }
  );
  const user = res.records.map((record) => {
    const u: User = record.get("u").properties;
    return {
      name: u.name,
      tweetCount: u.tweetCount ? u.tweetCount.toInt() : undefined,
      followingCount: u.followingCount ? u.followingCount.toInt() : undefined,
      followersCount: u.followersCount ? u.followersCount.toInt() : undefined,
      createdAt: u.createdAt ? new Date(u?.createdAt).toString() : undefined,
      username: u.username,
    };
  })[0];
  return user;
};
