import type { Context } from "@src/server/context";

interface QueryUsersArgs {
  options: {
    usernames: string[];
  };
}

export const users = async (
  _root: unknown,
  args: QueryUsersArgs,
  ctx: Context
) => {
  return [
    {
      id: 0,
      tweet_count: 11745,
      following_count: 244,
      followers_count: 108905480,
      domain: "katyperry.com",
      name: "KATY PERRY",
      created_at: 2009,
      username: "katyperry",
    },
  ];
};
