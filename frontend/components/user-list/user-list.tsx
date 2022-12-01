import { FC, useEffect, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import cloneDeep from "lodash/cloneDeep";

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

type Props = {
  className?: string;
  onClick?: (user: User) => void;
};

export const UserList: FC<Props> = ({ className, onClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { username } = useGraphContext();
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { usernames: [] },
  });

  useEffect(() => {
    if (loading) return;

    const clonedUsers = cloneDeep(data.users);
    clonedUsers.sort((u1: User, u2: User) =>
      u1.name.toLowerCase() < u2.name.toLowerCase() ? -1 : 1
    );

    setUsers(clonedUsers);
  }, [loading]);

  useEffect(() => {
    refetch({ usernames: [] });
  }, [username]);

  return (
    <div className={className}>
      {users.map((user: User) => {
        return (
          <a
            key={user.username}
            onClick={() => (onClick ? onClick(user) : null)}
            className="cursor-pointer hover:underline">
            <p>{user.name}</p>
          </a>
        );
      })}
    </div>
  );
};
