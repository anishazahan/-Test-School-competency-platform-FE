"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function Timer({
  dueAt,
  onExpire,
}: {
  dueAt: string;
  onExpire: () => void;
}) {
  const [now, setNow] = useState<number>(Date.now());
  const due = useMemo(() => new Date(dueAt).getTime(), [dueAt]);
  const calledRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // reset if dueAt changes
    calledRef.current = false;
    setExpired(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => setNow(Date.now()), 500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [due]);

  useEffect(() => {
    if (!calledRef.current && now >= due) {
      calledRef.current = true;
      setExpired(true);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Fire once
      try {
        onExpire();
      } catch {
        // no-op
      }
    }
  }, [now, due, onExpire]);

  const remaining = Math.max(0, Math.floor((due - now) / 1000));
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div
      aria-live="polite"
      className={`rounded-md px-3 py-1 text-sm ${
        expired
          ? "bg-red-100 text-red-700"
          : remaining < 30
          ? "bg-red-50 text-red-700"
          : "bg-muted"
      }`}
    >
      {expired
        ? "Time's up"
        : `Time Left: ${String(mins).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
          )}`}
    </div>
  );
}
