import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="md: flex h-screen items-center justify-center bg-slate-100 px-48 2xl:px-96">
      {children}
    </div>
  );
};
