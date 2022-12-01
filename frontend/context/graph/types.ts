import { Dispatch, SetStateAction } from "react";

export type Mode =
  | "details"
  | "relationships"
  | "tweets"
  | "shortest path"
  | "mutual follows";

export type ContextProps = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  destinationUser: string;
  setDestinationUser: Dispatch<SetStateAction<string>>;
  mode: Mode | null;
  setMode: Dispatch<SetStateAction<Mode | null>>;
};
