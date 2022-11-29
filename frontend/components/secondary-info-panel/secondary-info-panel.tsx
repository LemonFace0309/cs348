import React from "react";

import { TweetList } from "@src/components/tweet-list";
import { UserList } from "@src/components/user-list";
import { useGraphContext } from "@src/context/graph";

export const SecondaryInfoPanel = () => {
  const { mode, setDestinationUser } = useGraphContext();

  if (mode == "tweets") {
    return <TweetList />;
  }

  if (mode == "shortest path") {
    return (
      <UserList
        onClick={(user) => setDestinationUser(user.username)}
        className="max-h-80 w-full overflow-auto"
      />
    );
  }

  return <div>SecondaryInfoPanel</div>;
};
