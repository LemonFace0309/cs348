import { FC, ReactNode } from "react";

import { Nav } from "@src/components/layout/nav";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <div className="bg-green-700">
        <div className="m-auto">
          <Nav />
        </div>
      </div>
      <main className="flex grow items-center justify-center px-12 2xl:px-36">
        {children}
      </main>
    </div>
  );
};
