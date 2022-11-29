import { createContext, FC, ReactNode, useContext, useState } from "react";

import { ContextProps } from "./types";

export const useGraphContext = () => {
  return useContext(GraphContext);
};

export const GraphContext = createContext<ContextProps>({
  username: "",
  setUsername: () => null,
});

export const GraphProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState("");

  const value = {
    username,
    setUsername,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};
