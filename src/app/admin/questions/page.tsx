"use client";

import { useState } from "react";
import { useListQuestionsQuery, useCreateQuestionMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pagination, Question } from "@/lib/types";

export default function AdminQuestionsPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, refetch } = useListQuestionsQuery({
    page,
    limit: 10,
  });
  const paged = data as Pagination<Question> | undefined;

  const [text, setText] = useState("");
  const [level, setLevel] = useState("A1");
  const [competency, setCompetency] = useState("Information Literacy");
  const [choicesText, setChoicesText] = useState(
    "Option 1|Option 2|Option 3|Option 4"
  );
  const [correctIndex, setCorrectIndex] = useState(0);
  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation();

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Question Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Competency</TableHead>
                    <TableHead>Text</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    (paged?.items ?? []).map((q) => (
                      <TableRow key={q._id}>
                        <TableCell>{q.level}</TableCell>
                        <TableCell>{q.competency}</TableCell>
                        <TableCell className="max-w-[400px] truncate">
                          {q.text}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} / {paged?.totalPages ?? 1}
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

        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Level (A1-C2)</Label>
              <Input value={level} onChange={(e) => setLevel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Competency</Label>
              <Input
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Choices (pipe-separated)</Label>
              <Input
                value={choicesText}
                onChange={(e) => setChoicesText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Correct Index (0-3)</Label>
              <Input
                type="number"
                value={correctIndex}
                onChange={(e) =>
                  setCorrectIndex(parseInt(e.target.value || "0"))
                }
              />
            </div>
            <Button
              disabled={creating}
              onClick={async () => {
                const choices = choicesText
                  .split("|")
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (!choices.length) return;
                await createQuestion({
                  level: level as Question["level"],
                  competency,
                  text,
                  choices,
                  correctIndex,
                });
                setText("");
                await refetch();
              }}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
