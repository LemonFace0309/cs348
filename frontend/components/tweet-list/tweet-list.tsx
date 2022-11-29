import { FC } from "react";

import { gql, useQuery } from "@apollo/client";

import { useGraphContext } from "@src/context/graph";
import { Tweet } from "@src/lib/types";

const GET_TWEETS = gql`
  query GetTweets($username: String!) {
    tweets(username: $username) {
      createdAt
      text
      tweetId
    }
  }
`;

type Props = {
  onClick?: (tweet: Tweet) => void;
};

export const TweetList: FC<Props> = ({ onClick }) => {
  const { username } = useGraphContext();
  const { loading, error, data } = useQuery(GET_TWEETS, {
    variables: { username },
  });

  return (
    <div className="w-full">
      <h4 className="text-xl">tweetId &middot; text &middot; createdAt</h4>
      {!loading &&
        data.tweets.map((tweet: Tweet) => {
          return (
            <div
              key={tweet.tweetId}
              onClick={() => (onClick ? onClick(tweet) : null)}>
              <p>{tweet.tweetId}</p>
              <p>{tweet.text}</p>
              <p>{tweet.createdAt}</p>
              <hr></hr>
            </div>
          );
        })}
    </div>
  );
};
