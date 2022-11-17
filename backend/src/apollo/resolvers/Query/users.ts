import type { Context } from "@src/server/context";
import type { User } from "@src/typings";

interface QueryUsersArgs {
  usernames: string[];
}

export const users = async (
  _root: unknown,
  args: QueryUsersArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;
  const query = args.usernames.length
    ? "MATCH (u:User) \
    WHERE u.username IN $usernamesParam \
    RETURN u;"
    : "MATCH (u:User) \
    RETURN u;";

  const res = await neo4j.run(query, {
    usernamesParam: args.usernames,
  });
  const users = res.records.map((record) => {
    const u: User = record.get("u").properties;
    console.log(u);
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
