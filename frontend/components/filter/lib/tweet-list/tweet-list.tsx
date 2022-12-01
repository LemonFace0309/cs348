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
    <div className="max-h-80 w-full overflow-auto text-left">
      {!loading &&
        data.tweets.map((tweet: Tweet) => {
          return (
            <div
              key={tweet.tweetId}
              onClick={() => (onClick ? onClick(tweet) : null)}>
              <p className="text-lg">
                <b>Tweet Id:</b> {tweet.tweetId}
              </p>
              <p className="text-lg">
                <b>Text:</b> {tweet.text}
              </p>
              <p className="text-lg">
                <b>Created At:</b> {tweet.createdAt}
              </p>
              <hr></hr>
            </div>
          );
        })}
    </div>
  );
};
