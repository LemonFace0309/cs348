import { useState } from "react";

import { Button } from "@src/components/button";
import { Dialog } from "@src/components/dialog";
import { Input } from "@src/components/input";

export const AddUserButton = () => {
  const [modalIsOpen, setModalisOpen] = useState(false);

  return (
    <>
      <Dialog
        title="Enter A Peron's Twitter Username"
        open={modalIsOpen}
        setOpen={setModalisOpen}>
        <div className="mt-4">
          {/* <p className="text-sm text-gray-500">
            Your payment has been successfully submitted. We’ve sent you an
            email with all of the details of your order.
          </p> */}
          <form className="flex flex-col">
            <Input name="add-username" placeholder="ladygaga" />
          </form>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setModalisOpen(false)}>
            Finish
          </button>
        </div>
      </Dialog>
      <Button onClick={() => setModalisOpen(true)}>Add User</Button>
    </>
  );
};
