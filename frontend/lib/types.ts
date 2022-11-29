export type User = {
  name: string;
  username: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
};

export type Tweet = {
  tweetId: string;
  text: string;
  createdAt: string;
};
