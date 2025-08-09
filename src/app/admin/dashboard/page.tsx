"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminStatsQuery, useListUsersQuery } from "@/lib/api";
import { useAdminCertificatesQuery } from "@/lib/api";
import type {
  AdminStats,
  AdminCertificateListItem,
  Pagination,
  UserListItem,
} from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

const roleColorMap: Record<string, string> = {
  admin: "#7c3aed", // purple
  student: "#16a34a", // green
  supervisor: "#f59e0b", // amber
  // fallback for any unexpected roles
  default: "#6b7280", // gray
};

const statusColorMap: Record<string, string> = {
  not_started: "#6b7280",
  in_progress: "#0ea5e9",
  completed: "#16a34a",
  locked: "#ef4444",
  default: "#6b7280",
};

const levelColorMap: Record<string, string> = {
  A1: "#0ea5e9",
  A2: "#22c55e",
  B1: "#f59e0b",
  B2: "#6366f1",
  C1: "#ef4444",
  C2: "#14b8a6",
  default: "#6b7280",
};

export default function AdminDashboardPage() {
  const { data: stats, isFetching: statsLoading } = useAdminStatsQuery();
  const [usersPage, setUsersPage] = useState(1);
  const [certsPage, setCertsPage] = useState(1);
  const usersLimit = 10;
  const certsLimit = 10;

  const { data: usersPaged, isFetching: usersLoading } = useListUsersQuery({
    page: usersPage,
    limit: usersLimit,
  });
  const { data: certsPaged, isFetching: certsLoading } =
    useAdminCertificatesQuery({
      page: certsPage,
      limit: certsLimit,
    });

  const usersByRoleData = useMemo(() => {
    if (!stats) return [];
    // hide "instructor" role manually
    const filtered = (stats as AdminStats).usersByRole
      .filter(
        (x) =>
          String(x._id).toLowerCase() === "student" ||
          String(x._id).toLowerCase() === "admin"
      )
      .map((x) => ({ role: x._id, count: x.count }));
    return filtered;
  }, [stats]);

  const examsByStatusData = useMemo(() => {
    if (!stats) return [];
    return stats.examsByStatus.map((x) => ({ status: x._id, count: x.count }));
  }, [stats]);

  const certsByLevelData = useMemo(() => {
    if (!stats) return [];
    return stats.certificatesByLevel.map((x) => ({
      level: x._id,
      count: x.count,
    }));
  }, [stats]);

  const avgScoreByStepData = useMemo(() => {
    if (!stats) return [];
    return stats.avgScoreByStep.map((x) => ({
      step: x._id,
      avg: Number((x.avgPct ?? 0).toFixed(1)),
    }));
  }, [stats]);

  const dailyRegsData = useMemo(() => {
    if (!stats) return [];
    return stats.dailyRegistrations.map((x) => ({
      day: x._id,
      count: x.count,
    }));
  }, [stats]);

  const competencyAccuracyData = useMemo(() => {
    if (!stats) return [];
    return stats.competencyAccuracy.map((x) => ({
      competency: x._id,
      pct: Number((x.pct ?? 0).toFixed(1)),
    }));
  }, [stats]);

  return (
    <main className="mx-auto max-w-7xl p-4">
      <Tabs defaultValue="stats" className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className=" text-xl sm:text-2xl font-semibold">
            Admin Dashboard
          </h1>
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="stats">
              Statistics
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="table">
              Table view
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stats">
          {statsLoading ? (
            <div>Loading statistics...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card className="h-[320px]">
                <CardHeader>
                  <CardTitle>Users by role</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usersByRoleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count">
                        {usersByRoleData.map((entry, idx) => {
                          const key = String(entry.role).toLowerCase();

                          const fill =
                            roleColorMap[key] ?? roleColorMap.default;
                          return <Cell key={`role-cell-${idx}`} fill={fill} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="h-[320px]">
                <CardHeader>
                  <CardTitle>Exams by status</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={examsByStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count">
                        {examsByStatusData.map((entry, idx) => {
                          const fill =
                            statusColorMap[entry.status] ??
                            statusColorMap.default;
                          return (
                            <Cell key={`status-cell-${idx}`} fill={fill} />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="h-[320px]">
                <CardHeader>
                  <CardTitle>Certificates by level</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={certsByLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count">
                        {certsByLevelData.map((entry, idx) => {
                          const fill =
                            levelColorMap[entry.level] ?? levelColorMap.default;
                          return <Cell key={`level-cell-${idx}`} fill={fill} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="h-[320px]">
                <CardHeader>
                  <CardTitle>Average score by step (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={avgScoreByStepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#0ea5e9"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="h-[320px]">
                <CardHeader>
                  <CardTitle>Daily registrations (last 7 days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyRegsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#16a34a"
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 xl:col-span-3 h-[360px]">
                <CardHeader>
                  <CardTitle>Top competencies by accuracy (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competencyAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="competency"
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="pct" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <div className="grid grid-cols-1 gap-6">
            {/* Users table */}
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 bg-gradient-to-bl">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={4}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                        (
                          (usersPaged as Pagination<UserListItem> | undefined)
                            ?.items ?? []
                        ).map((u) => (
                          <TableRow key={u._id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell className="capitalize">
                              {typeof u?.role === "string" &&
                                u?.role !== "instructor" &&
                                u?.role}
                            </TableCell>

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
                    Page {usersPage} of{" "}
                    {(usersPaged as Pagination<UserListItem> | undefined)
                      ?.totalPages ?? 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage((p) => p - 1)}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        usersPage >=
                        ((usersPaged as Pagination<UserListItem> | undefined)
                          ?.totalPages ?? 1)
                      }
                      onClick={() => setUsersPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificates table */}
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Issued</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certsLoading ? (
                        <TableRow>
                          <TableCell colSpan={4}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                        (
                          (
                            certsPaged as
                              | Pagination<AdminCertificateListItem>
                              | undefined
                          )?.items ?? []
                        ).map((c) => (
                          <TableRow key={c._id}>
                            <TableCell>{c.user.name}</TableCell>
                            <TableCell>{c.user.email}</TableCell>
                            <TableCell>{c.level}</TableCell>
                            <TableCell>
                              {new Date(c.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {certsPage} of{" "}
                    {(
                      certsPaged as
                        | Pagination<AdminCertificateListItem>
                        | undefined
                    )?.totalPages ?? 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={certsPage <= 1}
                      onClick={() => setCertsPage((p) => p - 1)}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        certsPage >=
                        ((
                          certsPaged as
                            | Pagination<AdminCertificateListItem>
                            | undefined
                        )?.totalPages ?? 1)
                      }
                      onClick={() => setCertsPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
