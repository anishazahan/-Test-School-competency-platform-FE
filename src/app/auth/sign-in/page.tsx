"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/lib/hook";
import { setTokens, setUser } from "@/lib/slices/auth-slices";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            {"Access your account and continue your assessment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={async () => {
              const parsed = schema.safeParse({ email, password });
              if (!parsed.success) {
                toast({
                  title: "Invalid input",
                  description: "Please check your email and password.",
                });
                return;
              }
              const res = await login(parsed.data);
              if ("data" in res) {
                dispatch(setTokens(res.data.tokens));
                dispatch(setUser(res.data.user));
                toast({
                  title: "Welcome back",
                  description: "Login successful.",
                });
                if (res?.data.user.role === "admin")
                  router.push("/admin/dashboard");
                else if (res?.data.user.role === "supervisor")
                  router.push("/supervisor/dashboard");
                else router.push("/exam");
              } else {
                toast({
                  title: "Login failed",
                  description:
                    (res as any).error?.data?.message ?? "Unexpected error",
                  variant: "destructive",
                });
              }
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Link className="underline" href="/auth/sign-up">
              Create account
            </Link>
            <Link className="underline" href="/auth/forgot-password">
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
