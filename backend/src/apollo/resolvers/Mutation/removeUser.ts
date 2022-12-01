import type { Context } from "@src/server/context";
import type { User } from "@src/typings";

interface MutateRemoveUserArgs {
  username: string;
}

export const removeUser = async (
  _root: unknown,
  args: MutateRemoveUserArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;
  try {
    const res = await neo4j.run(
      "MATCH (u:User {username: $usernameParam}) \
      DETACH DELETE u;",
      {
        usernameParam: args.username,
      }
    );
  } catch (err) {
    return false;
  }
  return true;
};
