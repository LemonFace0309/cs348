import React from "react";

import { RelationshipTabs } from "@src/components/filter/relationship-tabs";
import { TweetList } from "@src/components/filter/tweet-list";
import { UserList } from "@src/components/user-list";
import { useGraphContext } from "@src/context/graph";

export const SecondaryInfoPanel = () => {
  const { mode, setDestinationUser } = useGraphContext();

  if (mode == "relationships") {
    return <RelationshipTabs className="max-h-80 overflow-auto" />;
  }

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
