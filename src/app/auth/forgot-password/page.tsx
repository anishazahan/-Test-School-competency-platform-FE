"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [mutate, { isLoading }] = useForgotPasswordMutation();

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={async () => {
              const res = await mutate({ email });
              if ("data" in res)
                toast.info("Check your inbox", {
                  description: "Password reset link sent.",
                });
            }}
          >
            Send reset link
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
