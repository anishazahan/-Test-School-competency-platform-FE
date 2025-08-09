"use client";

import { useEffect, useMemo, useState } from "react";

export function Timer({
  dueAt,
  onExpire,
}: {
  dueAt: string;
  onExpire: () => void;
}) {
  const [now, setNow] = useState<number>(Date.now());
  const due = useMemo(() => new Date(dueAt).getTime(), [dueAt]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now >= due) {
      onExpire();
    }
  }, [now, due, onExpire]);

  const remaining = Math.max(0, Math.floor((due - now) / 1000));
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return (
    <div
      aria-live="polite"
      className={`rounded-md px-3 py-1 text-sm ${
        remaining < 30 ? "bg-red-100 text-red-700" : "bg-muted"
      }`}
    >
      Time Left: {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
