import { FollowersV2ParamsWithoutPaginator, TwitterApi } from "twitter-api-v2";
import { int, Session } from "neo4j-driver";

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
  let res = await neo4j.run(
    "CREATE (:User {username: $usernameParam, community: $communityParam})",
    {
      usernameParam: args.username,
      communityParam: int(10),
    }
  );

  await populateUser(neo4j, args.username);

  res = await neo4j.run(
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

const populateUser = async (neo4j: Session, username: string) => {
  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(
    process.env.TWITTER_API_BEARER as string
  );

  // Tell typescript it's a readonly app
  const client = twitterClient.readOnly;

  // FETCHING USER DATA
  const twitterRes = await client.v2.userByUsername(username, {
    "user.fields": "public_metrics,created_at",
    expansions: "pinned_tweet_id",
  });

  const user = twitterRes.data;
  const twitterId = user.id;
  await neo4j.run(
    "MATCH (u:User {username: $usernameParam}) \
        SET u += { twitterId: $twitterIdParam, name: $name, followersCount: $followersCountParam, followingCount: $followingCountParam, tweetCount: $tweetCountParam, createdAt: $createdAtParam} \
        RETURN u",
    {
      usernameParam: user.username,
      twitterIdParam: int(+user.id),
      name: user.name,
      followersCountParam: int(+(user.public_metrics?.followers_count ?? 0)),
      followingCountParam: int(+(user.public_metrics?.following_count ?? 0)),
      tweetCountParam: int(+(user.public_metrics?.tweet_count ?? 0)),
      createdAtParam: new Date(user.created_at ?? "0001").getTime(), // stores as ms, RETURN date({ epochMillis: $startsAt }) to convert to Date in cypher
    }
  );

  // FETCHING TWEET DATA
  const timeline = await client.v2.userTimeline(twitterId, {
    "tweet.fields": ["author_id", "created_at", "id", "text"],
    "media.fields": ["alt_text"],
  });
  let count = 0;
  for await (const tweet of timeline) {
    if (tweet.author_id === twitterId) {
      const res = await neo4j.run(
        "CREATE (t:Tweet {tweetId: $tweetIdParam, text: $textParam, createdAt: $createdAtParam}) \
            WITH t \
            MATCH (u:User {twitterId: $twitterIdParam}) \
            CREATE (u)-[r:Author]->(t);",
        {
          tweetIdParam: int(+tweet.id),
          textParam: tweet.text,
          twitterIdParam: int(+tweet.author_id),
          createdAtParam: new Date(tweet.created_at ?? "0001").getTime(),
        }
      );
    }
    count++;
    if (count === 10) break;
  }

  // FETCHING FOLLOWING
  let paginationToken: string | undefined = "";
  let followingTwitterIds: string[] = [];
  let paginationCount = 1;
  while (typeof paginationToken !== "undefined" && paginationCount <= 3) {
    const params: Partial<FollowersV2ParamsWithoutPaginator> = {
      "user.fields": ["id", "username"],
      max_results: 1000,
    };
    if (paginationToken) params.pagination_token = paginationToken;

    const following = await client.v2.following(twitterId, params);
    if (!following.data) break;

    paginationToken = following.meta.next_token;
    followingTwitterIds = followingTwitterIds.concat(
      following.data.map((user) => user.id)
    );
    paginationCount++;
  }

  // adding follows relation to db
  await neo4j.run(
    "MATCH (u2:User) \
        WHERE u2.twitterId in $followingTwitterIdsParam \
        MATCH (u1:User {twitterId: $twitterIdParam}) \
        WITH u1, u2 \
        CREATE (u1)-[r:Follows]->(u2);",
    {
      twitterIdParam: +twitterId,
      followingTwitterIdsParam: followingTwitterIds.map((id) => int(+id)),
    }
  );
};
