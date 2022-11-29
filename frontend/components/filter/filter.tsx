import { FC } from "react";

import { gql, useQuery } from "@apollo/client";

import { Button } from "@src/components/button";
import type { Option } from "@src/components/radio-group";
import { RadioGroup } from "@src/components/radio-group";
import { useGraphContext } from "@src/context/graph";
import { Mode } from "@src/context/graph/types";
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

const options: Option[] = [
  {
    text: "Relationships",
    subtext: "Arrows point in the diretion of who follows who",
  },
  {
    text: "Tweets",
    subtext: "Get the three most recent tweets",
  },
  {
    text: "Shortest Path",
    subtext: "Get the shortest path between two users",
  },
];

export const Filter: FC = () => {
  const { username, setUsername, setMode } = useGraphContext();
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { usernames: [] },
  });

  const nodeOptionHandler = (option: Option) => {
    console.log(option.text.toLowerCase());
    setMode(option.text.toLowerCase() as Mode);
  };

  const clearHandler = () => {
    setUsername("");
    setMode(null);
  };

  return (
    <div className="flex w-48 flex-col items-center space-y-5 p-4 text-center 2xl:w-96">
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
      {!loading && username && (
        <div className="text-left">
          <RadioGroup onClick={nodeOptionHandler} options={options} />
        </div>
      )}
      <Button onClick={clearHandler}>Clear</Button>
    </div>
  );
};
