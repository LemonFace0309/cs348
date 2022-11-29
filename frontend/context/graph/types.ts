import { Dispatch, SetStateAction } from "react";

export type ContextProps = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};
