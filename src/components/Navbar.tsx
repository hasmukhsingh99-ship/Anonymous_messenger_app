"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4  md:p-6 shadow-md">
      <div className="w-full  mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 mb:mb-0" href="#">
          Mystery Message
        </a>
        <div className="flex gap-10 items-center">

        {session ? (
          <>
            <span className="mr-4 shrink-0">
              Welcome, <span className="font-bold">{user?.username || user?.email || "User"}</span> 
            </span>


            <Button className="w-full md:mx-auto" onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link className="w-full md:mx-auto" href={"/sign-in"}>
            <Button>Sign In</Button>
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
