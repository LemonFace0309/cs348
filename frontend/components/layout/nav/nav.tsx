import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { Button } from "@src/components/button";
import { useAuthContext } from "@src/context/auth";

export const Nav: FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();

  const switchAuth = () => {
    setIsAuthenticated((prev) => !prev);
  };

  return (
    <nav className="flex justify-between p-4">
      <Link
        href="/"
        className="flex items-center transition hover:-rotate-3 hover:scale-105">
        <Image src="/logo.png" alt="logo" width={30} height={30} />
        <h1 className="ml-4 text-4xl text-white">Squiggles</h1>
      </Link>
      {!isAuthenticated ? (
        <Button onClick={switchAuth}>Login</Button>
      ) : (
        <Button onClick={switchAuth}>Sign Out</Button>
      )}
    </nav>
  );
};
