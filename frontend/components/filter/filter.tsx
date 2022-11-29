import { FC } from "react";

import { gql, useQuery } from "@apollo/client";

import { Button } from "@src/components/button";
import { useGraphContext } from "@src/context/graph";
import { User } from "@src/lib/types";

const GET_USERS = gql`
  query GetUsers($usernames: [String!]!) {
    users(usernames: $usernames) {
      createdAt
      followersCount
      followingCount
      name
      tweetCount
      username
    }
  }
`;

export const Filter: FC = () => {
  const { username, setUsername } = useGraphContext();
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { usernames: [] },
  });

  return (
    <div className="flex w-48 flex-col items-center space-y-5 p-4 text-center">
      <h1 className="text-4xl">Filter</h1>
      <div className="max-h-80 w-full overflow-auto">
        {!loading &&
          !username &&
          data.users.map((user: User) => {
            return (
              <a
                key={user.username}
                onClick={() => setUsername(user.username)}
                className="cursor-pointer hover:underline">
                <p>{user.username}</p>
              </a>
            );
          })}
      </div>
      {/* {username && (

      )} */}
      <Button onClick={() => setUsername("")}>Clear</Button>
    </div>
  );
};
