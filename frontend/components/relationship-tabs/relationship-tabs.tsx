import { FC, useMemo } from "react";

import { gql, useQuery } from "@apollo/client";
import cx from "classnames";

import { Categories, Tabs } from "@src/components/tabs";
import { useGraphContext } from "@src/context/graph";
import { User } from "@src/lib/types";

const GET_FOLLOWS = gql`
  query GetFollows($username: String!) {
    follows(username: $username) {
      createdAt
      followersCount
      followingCount
      name
      tweetCount
      username
    }
  }
`;

const GET_FOLLOWING = gql`
  query GetFollowing($username: String!) {
    following(username: $username) {
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
};

export const RelationshipTabs: FC<Props> = ({ className }) => {
  const { username } = useGraphContext();
  const {
    loading: l1,
    error: e1,
    data: d1,
  } = useQuery(GET_FOLLOWS, {
    variables: { username },
  });
  const {
    loading: l2,
    error: e2,
    data: d2,
  } = useQuery(GET_FOLLOWING, {
    variables: { username },
  });
  const loading = l1 || l2;
  const error = e1 || e2;

  const categories = useMemo<Categories>(() => {
    return {
      Follows:
        l1 || !d1?.follows
          ? []
          : d1.follows.map((user: User, idx: number) => ({
              id: idx,
              title: user.name,
              date: user.createdAt,
              subText: user.username,
            })),
      Following:
        l2 || !d2?.following
          ? []
          : d2.following.map((user: User, idx: number) => ({
              id: idx,
              title: user.name,
              date: user.createdAt,
              subText: user.username,
            })),
    };
  }, [l1, l2, d1, d2]);

  return (
    <div className={cx(className, "text-left")}>
      {!loading && <Tabs categories={categories} />}
    </div>
  );
};
