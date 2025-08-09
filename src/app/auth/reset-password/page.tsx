"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useResetPasswordMutation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [mutate, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={async () => {
              const res = await mutate({ token, password });
              if ("data" in res) {
                toast.success("Password updated", {
                  description: "You can sign in now.",
                });
                router.push("/auth/sign-in");
              }
            }}
          >
            Update password
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
