"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminDashboardSkeleton() {
  return (
    <main className="mx-auto max-w-7xl p-4">
      {/* Tabs header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* Stats skeleton grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className={
              i === 5 ? "md:col-span-2 xl:col-span-3 h-[360px]" : "h-[320px]"
            }
          >
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="h-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeletons */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        {[...Array(2)].map((_, tableIndex) => (
          <Card key={tableIndex}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <TableHead key={i}>
                          <Skeleton className="h-4 w-20" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Array.from({ length: 4 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination skeleton */}
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
