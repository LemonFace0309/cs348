import { createContext, FC, ReactNode, useContext, useState } from "react";

import { ContextProps, Mode } from "./types";

export const useGraphContext = () => {
  return useContext(GraphContext);
};

export const GraphContext = createContext<ContextProps>({
  username: "",
  setUsername: () => null,
  destinationUser: "",
  setDestinationUser: () => null,
  mode: "relationships",
  setMode: () => null,
});

export const GraphProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [destinationUser, setDestinationUser] = useState("");
  const [mode, setMode] = useState<Mode | null>("relationships");

  const value = {
    username,
    setUsername,
    destinationUser,
    setDestinationUser,
    mode,
    setMode,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};
