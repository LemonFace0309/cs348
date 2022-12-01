import { FC, ReactNode } from "react";

import cx from "classnames";

import { Nav } from "@src/components/layout/nav";

import styles from "./layout.module.css";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="bg-green-700">
        <div className="m-auto">
          <Nav />
        </div>
      </div>
      <main
        className={cx(
          "flex grow flex-col items-center justify-center px-12 2xl:px-36",
          styles.main
        )}>
        {children}
      </main>
    </div>
  );
};
