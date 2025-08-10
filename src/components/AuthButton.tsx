"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAppSelector } from "@/lib/hook";

const AuthButton = () => {
  const user = useAppSelector((s) => s.auth.user);

  console.log(user?.role === "admin");

  if (user?.role === "admin") return;
  return (
    <div className="flex  gap-3 flex-row justify-center lg:justify-start">
      <Button asChild className="w-auto">
        <Link href="/auth/sign-up">Get Started</Link>
      </Button>
      <Button asChild variant="outline" className="w-auto">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    </div>
  );
};

export default AuthButton;
