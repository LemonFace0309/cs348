import { gql, useMutation } from "@apollo/client";

import { Button } from "@src/components/button";
import { useGraphContext } from "@src/context/graph";

const CREATE_USER = gql`
  mutation remoteUser($username: String!) {
    removeUser(username: $username)
  }
`;

export const RemoveUserButton = () => {
  const { username, setUsername, setMode, setDestinationUser } =
    useGraphContext();
  const [removeUser, { data, loading, error }] = useMutation(CREATE_USER);

  const removeUserHandler = async () => {
    await removeUser({ variables: { username } });
    setUsername("");
    setDestinationUser("");
    setMode("relationships");
  };

  return (
    <Button onClick={removeUserHandler} level="warn">
      Remove User
    </Button>
  );
};
