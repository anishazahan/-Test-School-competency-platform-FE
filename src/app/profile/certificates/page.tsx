"use client";

import { useMyCertificatesQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/lib/types";
import { useDownloadCertificateByIdMutation } from "@/lib/api";

export default function CertificatesPage() {
  const { data, isFetching } = useMyCertificatesQuery();
  const items = (data?.items ?? []) as Certificate[];
  const [downloadById, { isLoading: downloading }] =
    useDownloadCertificateByIdMutation();

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
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const blob = await downloadById({ id: c._id }).unwrap();
                        const url = URL.createObjectURL(blob);
                        window.open(url, "_blank", "noopener,noreferrer");
                        setTimeout(() => URL.revokeObjectURL(url), 60_000);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    disabled={downloading}
                  >
                    {downloading ? "Preparing..." : "Download PDF"}
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>
    </main>
  );
}
