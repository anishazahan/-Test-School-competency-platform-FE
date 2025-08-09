"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/lib/api";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const emailParam = params.get("email") ?? "";
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resend, { isLoading: isResending }] = useResendOtpMutation();
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
            />
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={async () => {
              const res = await verifyOtp({ email, otp });
              if ("data" in res) {
                toast.success("Verified", {
                  description: "Your email is now verified. Please sign in.",
                });
                router.push("/auth/sign-in");
              } else {
                toast.error("Invalid OTP", {
                  description: (res as any).error?.data?.message ?? "Try again",
                });
              }
            }}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isResending}
            onClick={async () => {
              const res = await resend({ email });
              if ("data" in res)
                toast.info("OTP resent", {
                  description: "Check your email.",
                });
            }}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
