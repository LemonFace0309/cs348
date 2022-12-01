import { FC } from "react";

import { gql, useQuery } from "@apollo/client";

import { useGraphContext } from "@src/context/graph";
import { User } from "@src/lib/types";

const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      createdAt
      followersCount
      followingCount
      name
      tweetCount
      username
    }
  }
`;

type Props = {
  onClick?: (user: User) => void;
};

export const UserDetails: FC<Props> = ({ onClick }) => {
  const { username } = useGraphContext();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { username },
  });

  return (
    <div className="max-h-80 w-full overflow-auto text-left">
      {!loading && (
        <div key={data.user.username}>
          <p className="text-lg">
            <b>Name:</b> {data.user.name}
          </p>
          <p className="text-lg">
            <b>Username:</b> {data.user.username}
          </p>
          <p className="text-lg">
            <b>createdAt:</b> {data.user.createdAt}
          </p>
          <p className="text-lg">
            <b>followersCount:</b> {data.user.followersCount}
          </p>
          <p className="text-lg">
            <b>followingCount:</b> {data.user.followingCount}
          </p>
          <p className="text-lg">
            <b>tweetCount:</b> {data.user.tweetCount}
          </p>
        </div>
      )}
    </div>
  );
};
