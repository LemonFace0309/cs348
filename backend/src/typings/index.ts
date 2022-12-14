import { Integer } from "neo4j-driver";

export interface User {
  twitterId?: Integer;
  name: string;
  username?: string;
  createdAt?: number;
  followersCount?: Integer;
  followingCount?: Integer;
  tweetCount?: Integer;
}

export interface Tweet {
  tweetId: Integer;
  text: string;
  createdAt: number;
}