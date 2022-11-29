import { createContext, FC, ReactNode, useContext, useState } from "react";

import { ContextProps, Mode } from "./types";

export const useGraphContext = () => {
  return useContext(GraphContext);
};

export const GraphContext = createContext<ContextProps>({
  username: "",
  setUsername: () => null,
  mode: null,
  setMode: () => null,
});

export const GraphProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);

  const value = {
    username,
    setUsername,
    mode,
    setMode,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};
