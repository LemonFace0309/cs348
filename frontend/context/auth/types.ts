import { Dispatch, SetStateAction } from "react";

export type ContextProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};
