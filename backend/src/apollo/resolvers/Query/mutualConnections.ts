import type { Context } from "@src/server/context";
import type { User } from "@src/typings";

interface QueryMutualConnectionsArgs {
  input: {
    startUsername: string;
    endUsername: string;
  };
}

export const mutualConnections = async (
  _root: unknown,
  args: QueryMutualConnectionsArgs,
  ctx: Context
) => {
  const { neo4j } = ctx;

  const res = await neo4j.run(
    "MATCH (A:User {username: $startUsernameParam}), (B:User {username: $endUsernameParam}) \
    WITH [(A)-[:Follows]->(N)<-[:Follows]-(B) WHERE N:User|N.username] AS mutual_names \
    RETURN mutual_names",
    {
      startUsernameParam: args.input.startUsername,
      endUsernameParam: args.input.endUsername,
    }
  );
  if (!res.records.length) return [];

  return res.records[0].get("mutual_names");
};
