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
    <nav className="flex justify-between p-4 ">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={30}
          height={30}
          className="cursor-pointer transition hover:-rotate-3 hover:scale-105"
        />
      </Link>
      {!isAuthenticated ? (
        <Button onClick={switchAuth}>Login</Button>
      ) : (
        <Button onClick={switchAuth}>Sign Out</Button>
      )}
    </nav>
  );
};
