import type { Context } from "@src/server/context";

interface QueryUserArgs {
  options: {
    username: string;
  };
}

export const user = async (
  _root: unknown,
  args: QueryUserArgs,
  ctx: Context
) => {
  return {
    id: 0,
    tweet_count: 11745,
    following_count: 244,
    followers_count: 108905480,
    domain: "katyperry.com",
    name: "KATY PERRY",
    created_at: 2009,
    username: "katyperry",
  };
};
