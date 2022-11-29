import { FC } from "react";

import { gql, useQuery } from "@apollo/client";

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

type Props = {
  className?: string;
  onClick?: (user: User) => void;
};

export const UserList: FC<Props> = ({ className, onClick }) => {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { usernames: [] },
  });

  return (
    <div className={className}>
      {!loading &&
        data.users.map((user: User) => {
          return (
            <a
              key={user.username}
              onClick={() => (onClick ? onClick(user) : null)}
              className="cursor-pointer hover:underline">
              <p>{user.username}</p>
            </a>
          );
        })}
    </div>
  );
};
