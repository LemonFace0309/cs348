import { createContext, FC, ReactNode, useContext } from "react";

import { ContextProps } from "./types";

export const useGraphContext = () => {
  return useContext(GraphContext);
};

export const GraphContext = createContext<ContextProps>({
  username1: "",
});

export const GraphProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const value = {
    username1: "",
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};
