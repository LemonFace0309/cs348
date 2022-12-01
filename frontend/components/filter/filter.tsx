import { FC } from "react";

import { Button } from "@src/components/button";
import { AddUserButton } from "@src/components/filter/add-user-button";
import { SecondaryInfoPanel } from "@src/components/filter/secondary-info-panel";
import type { Option } from "@src/components/radio-group";
import { RadioGroup } from "@src/components/radio-group";
import { UserList } from "@src/components/user-list";
import { useAuthContext } from "@src/context/auth";
import { useGraphContext } from "@src/context/graph";
import { Mode } from "@src/context/graph/types";

const options: Option[] = [
  {
    text: "Relationships",
    subtext: "Arrows point in the diretion of who follows who",
  },
  {
    text: "Tweets",
    subtext: "Get the three most recent tweets",
  },
  {
    text: "Shortest Path",
    subtext: "Get the shortest path between two users",
  },
];

export const Filter: FC = () => {
  const { username, setUsername, setMode, setDestinationUser } =
    useGraphContext();
  const { isAuthenticated } = useAuthContext();

  const nodeOptionHandler = (option: Option) => {
    setMode(option.text.toLowerCase() as Mode);
  };

  const clearHandler = () => {
    setUsername("");
    setDestinationUser("");
    setMode("relationships");
  };

  return (
    <div className="flex w-48 flex-col items-center space-y-5 p-4 text-center 2xl:w-96">
      <h1 className="text-4xl">{username ? username : "Filter"}</h1>
      {!username && (
        <UserList
          onClick={(user) => setUsername(user.username)}
          className="max-h-80 w-full overflow-auto"
        />
      )}
      {username && (
        <div className="text-left">
          <RadioGroup onClick={nodeOptionHandler} options={options} />
        </div>
      )}
      <div className="flex w-full items-center justify-center space-x-6">
        <Button onClick={clearHandler}>Clear</Button>
        {isAuthenticated && username ? (
          <Button onClick={() => null} level="warn">
            Remove User
          </Button>
        ) : isAuthenticated ? (
          <AddUserButton />
        ) : null}
      </div>
      {username && (
        <div className="mt-16 w-full">
          <hr />
          <h2 className="text-2xl">Details & Configuations</h2>
          <SecondaryInfoPanel />
        </div>
      )}
    </div>
  );
};
