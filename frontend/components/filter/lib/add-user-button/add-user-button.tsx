import { useRef, useState } from "react";

import { gql, useMutation } from "@apollo/client";

import { Button } from "@src/components/button";
import { Dialog } from "@src/components/dialog";
import { Input } from "@src/components/input";
import { LoadingIcon } from "@src/components/loading-icon";
import { useGraphContext } from "@src/context/graph";

const CREATE_USER = gql`
  mutation createUser($username: String!) {
    createUser(username: $username) {
      createdAt
      followersCount
      followingCount
      name
      tweetCount
      username
    }
  }
`;

export const AddUserButton = () => {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  const { setUsername } = useGraphContext();
  const [modalIsOpen, setModalisOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addUserHandler = async () => {
    setIsLoading(true);
    await createUser({
      variables: { username: inputRef?.current?.value ?? "" },
    });
    inputRef?.current?.value && setUsername(inputRef?.current?.value);
    setIsLoading(false);
    setModalisOpen(false);
  };

  return (
    <>
      <Dialog
        title="Enter A Person's Twitter Username"
        open={modalIsOpen}
        setOpen={setModalisOpen}>
        <div className="mt-4">
          <Input
            ref={inputRef}
            id="add_username"
            name="add-username"
            placeholder="ladygaga"
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={isloading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={addUserHandler}>
            <p className="mr-2">Finish</p>
            {isloading && <LoadingIcon />}
          </button>
        </div>
      </Dialog>
      <Button onClick={() => setModalisOpen(true)}>Add User</Button>
    </>
  );
};
