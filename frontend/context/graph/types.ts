import { Dispatch, SetStateAction } from "react";

export type Mode = "relationships" | "tweets" | "shortest path";

export type ContextProps = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  destinationUser: string;
  setDestinationUser: Dispatch<SetStateAction<string>>;
  mode: Mode | null;
  setMode: Dispatch<SetStateAction<Mode | null>>;
};
