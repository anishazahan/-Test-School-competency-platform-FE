"use client";

import { useState } from "react";
import { z } from "zod";
import { useRegisterMutation } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            {"Sign up to start your assessment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              const parsed = schema.safeParse({ name, email, password });
              if (!parsed.success) return;
              const res = await register(parsed.data);
              if ("data" in res) {
                toast.info("Verify your email", {
                  description: "We sent you an OTP to verify your account.",
                });
                router.push(
                  `/auth/verify-otp?email=${encodeURIComponent(email)}`
                );
              } else {
                toast.error("Registration failed", {
                  description:
                    (res as any).error?.data?.message ?? "Unexpected error",
                });
              }
            }}
          >
            {isLoading ? "Creating..." : "Create account"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
