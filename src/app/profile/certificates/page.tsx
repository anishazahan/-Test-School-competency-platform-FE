"use client";

import { useMyCertificatesQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/lib/types";

export default function CertificatesPage() {
  const { data, isFetching } = useMyCertificatesQuery();
  const items = (data?.items ?? []) as Certificate[];

  return (
    <main className="mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isFetching
            ? "Loading..."
            : items.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <div className="font-medium">{c.level}</div>
                    <div className="text-sm text-muted-foreground">
                      Issued: {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_API_URL ?? ""
                      }/certificates/${c._id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download PDF
                    </a>
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>
    </main>
  );
}
