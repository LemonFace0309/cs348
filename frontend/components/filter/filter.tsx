import Link from "next/link";
import { FC } from "react";

import { AiOutlineLink } from "react-icons/ai";

import { Button } from "@src/components/button";
import { AddUserButton } from "@src/components/filter/lib/add-user-button";
import { RemoveUserButton } from "@src/components/filter/lib/remove-user-button";
import { SecondaryInfoPanel } from "@src/components/filter/lib/secondary-info-panel";
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
    text: "Details",
    subtext: "Provide general information about the user",
  },
  {
    text: "Tweets",
    subtext: "Get the three most recent tweets",
  },
  {
    text: "Shortest Path",
    subtext: "Get the shortest path between two users",
  },
  {
    text: "Mutual Follows",
    subtext: "Find common users these two users follow",
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

  const ButtonOptions = () => (
    <>
      <Button onClick={clearHandler}>Clear</Button>
      {isAuthenticated && username ? (
        <RemoveUserButton />
      ) : isAuthenticated ? (
        <AddUserButton />
      ) : null}
    </>
  );

  return (
    <div className="flex w-48 flex-col items-center space-y-5 p-4 text-center 2xl:w-96">
      <h1 className="text-4xl">
        {username ? (
          <Link
            href={`https://twitter.com/${username}`}
            target="_blank"
            className="flex cursor-pointer content-center items-center hover:underline">
            <p>{username}</p>
            <AiOutlineLink size={48} />
          </Link>
        ) : (
          "Filter"
        )}
      </h1>
      {!username ? (
        <UserList
          onClick={(user) => setUsername(user.username)}
          className="max-h-80 w-full overflow-auto"
        />
      ) : (
        <div className="text-left">
          <RadioGroup onClick={nodeOptionHandler} options={options} />
        </div>
      )}
      <div className="flex w-full items-center justify-center space-x-6">
        <ButtonOptions />
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
