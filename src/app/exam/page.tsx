"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useGetExamStatusQuery,
  useStartStepMutation,
  useGetStepQuestionsQuery,
  useSubmitStepMutation,
  useDownloadLatestCertificateMutation,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Timer } from "@/components/timer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { PublicQuestion } from "@/lib/types";
import {
  clearExamLocalState,
  setExamLocalState,
} from "@/lib/slices/exam-slices";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

export default function ExamPage() {
  const dispatch = useAppDispatch();
  const { currentStep, dueAt } = useAppSelector((s) => s.exam);
  const { data: statusData, refetch: refetchStatus } = useGetExamStatusQuery();
  const [startStep, { isLoading: starting }] = useStartStepMutation();
  const { data: questionsData, isFetching: gettingQ } =
    useGetStepQuestionsQuery(currentStep!, { skip: !currentStep });
  const [submitStep, { isLoading: submitting }] = useSubmitStepMutation();
  const [downloadLatest, { isLoading: downloading }] =
    useDownloadLatestCertificateMutation();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [timeExpired, setTimeExpired] = useState(false);
  const [submitLock, setSubmitLock] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    if (statusData?.currentStep && !currentStep) {
      dispatch(
        setExamLocalState({
          currentStep: statusData.currentStep,
          dueAt: statusData.dueAt ?? null,
        })
      );
    }
  }, [statusData, currentStep, dispatch]);

  const questions = useMemo<PublicQuestion[]>(
    () => questionsData?.questions ?? [],
    [questionsData]
  );

  const handleStart = async () => {
    setStartError(null);
    try {
      const data = await startStep().unwrap();
      if (data?.step) {
        dispatch(
          setExamLocalState({ currentStep: data.step, dueAt: data.dueAt })
        );
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data ||
        (typeof err?.error === "string" ? err.error : null) ||
        "Failed to start step";
      setStartError(String(msg));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitLock || hasSubmitted) return;
    setSubmitLock(true);
    try {
      const payload = Object.entries(selected).map(([qid, cid]) => ({
        questionId: qid,
        choiceId: cid,
      }));
      const res = await submitStep({ answers: payload });
      if ("data" in res) {
        setHasSubmitted(true);
        dispatch(clearExamLocalState());
        await refetchStatus();
      }
    } finally {
      setSubmitLock(false);
    }
  }, [selected, submitStep, submitLock, hasSubmitted, dispatch, refetchStatus]);

  const onExpireOnce = useCallback(() => {
    if (timeExpired || hasSubmitted || submitLock) return;
    setTimeExpired(true);
    // auto-submit
    void handleSubmit();
  }, [timeExpired, hasSubmitted, submitLock, handleSubmit]);

  if (!statusData) return <div className="p-6">Loading...</div>;

  if (statusData.completed) {
    return (
      <main className="mx-auto max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Assessment complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              {"Your certified level:"}{" "}
              <span className="font-semibold">{statusData.result?.level}</span>
            </p>
            <Button
              onClick={async () => {
                try {
                  const blob = await downloadLatest().unwrap();
                  const url = URL.createObjectURL(blob);
                  window.open(url, "_blank", "noopener,noreferrer");
                  setTimeout(() => URL.revokeObjectURL(url), 60_000);
                } catch (e) {
                  console.error(e);
                }
              }}
              disabled={downloading}
            >
              {downloading ? "Preparing..." : "Download certificate"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/profile/certificates">View certificates</a>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exam</h1>
        {dueAt ? <Timer dueAt={dueAt} onExpire={onExpireOnce} /> : null}
      </div>
      <Separator className="mb-4" />

      {!currentStep ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {startError ? (
              <Alert
                variant="destructive"
                className="mb-2"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cannot start</AlertTitle>
                <AlertDescription>{startError}</AlertDescription>
              </Alert>
            ) : null}
            <p>
              {
                "You'll begin at Step 1 (A1/A2). Each step includes 44 questions with a timer of 1 minute per question (default)."
              }
            </p>
            <Button onClick={handleStart} disabled={starting}>
              {starting ? "Starting..." : "Start Step"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="mb-2 font-medium">Current Step: {currentStep}</div>
            <div className="text-sm text-muted-foreground">
              Answer all questions. Auto-submit on timer expiration.
            </div>
          </div>

          {gettingQ ? (
            <div>Loading questions...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {questions.map((q, idx) => (
                <Card key={q._id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {"Q" + (idx + 1) + ". "}
                      {q.text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid gap-2">
                      {q.choices.map((c) => (
                        <label
                          key={c.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-muted"
                        >
                          <input
                            type="radio"
                            name={`q-${q._id}`}
                            checked={selected[q._id] === c.id}
                            onChange={() =>
                              setSelected((prev) => ({
                                ...prev,
                                [q._id]: c.id,
                              }))
                            }
                            aria-label={`Choose ${c.text} for question`}
                          />
                          <span>{c.text}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                submitLock ||
                hasSubmitted ||
                !questions.length ||
                timeExpired
              }
            >
              {submitting || submitLock
                ? "Submitting..."
                : timeExpired
                ? "Time expired — submitting..."
                : "Submit step"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
