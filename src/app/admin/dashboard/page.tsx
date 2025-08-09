"use client";

import { useListUsersQuery } from "@/lib/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Pagination, UserListItem } from "@/lib/types";

export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useListUsersQuery({ page, limit: 10 });
  const paged = data as Pagination<UserListItem> | undefined;

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  (paged?.items ?? []).map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        {u.isVerified ? "Verified" : "Pending"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {paged?.totalPages ?? 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={page >= (paged?.totalPages ?? 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
