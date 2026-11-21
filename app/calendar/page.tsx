"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getWorkoutLogs } from "@/app/services/worklog.service";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const router = useRouter();

  const [today, setToday] = useState<Date | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null); // 0-11

  const [trainedDays, setTrainedDays] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  }, [router]);

  // Read the current date only on the client, after mount
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    if (year === null || month === null) return;

    let cancelled = false;
    const monthParam = `${year}-${String(month + 1).padStart(2, "0")}`;

    setLoading(true);
    setError(null);

    getWorkoutLogs(monthParam, token)
      .then((logs) => {
        if (cancelled) return;

        const map = new Map<number, number>();
        for (const log of logs) {
          const d = new Date(log.date);
          if (d.getFullYear() !== year || d.getMonth() !== month) continue;
          map.set(d.getDate(), (map.get(d.getDate()) ?? 0) + 1);
        }
        setTrainedDays(map);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof Error && err.message === "Unauthorized") {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Error while loading your workouts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, month, router, handleUnauthorized]);

  const goToPrevMonth = () => {
    if (month === null) return;
    if (month === 0) {
      setMonth(11);
      setYear((y) => (y === null ? y : y - 1));
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === null) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => (y === null ? y : y + 1));
    } else {
      setMonth(month + 1);
    }
  };

  // All hooks are above this line
  if (year === null || month === null || today === null) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-[#10140f] font-sans text-sm text-[#a7b0a2]">
        Loading calendar...
      </div>
    );
  }

  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="flex min-h-dvh flex-1 bg-[#10140f] font-sans text-[#f3f6ef]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 sm:px-10 lg:py-14">

        {/* Header */}

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/home"
            className="text-sm text-[#a7b0a2] transition hover:text-white"
          >
            Back to home
          </Link>
          <span className="text-xs font-semibold tracking-[0.15em] text-[#c6f135] uppercase">
            Calendar
          </span>
        </header>

        {/* Title */}

        <section className="mt-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#c6f135] uppercase">
            History
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Your workouts
          </h1>
          <p className="mt-2 text-base text-[#a7b0a2]">
            {loading
              ? "Loading..."
              : `${trainedDays.size} day${trainedDays.size === 1 ? "" : "s"} trained in ${monthLabel}.`}
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Month navigation */}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f3f6ef] transition hover:border-white/25 hover:bg-white/10"
          >
            ←
          </button>
          <h2 className="text-sm font-medium tracking-[0.10em] text-[#f3f6ef] uppercase">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f3f6ef] transition hover:border-white/25 hover:bg-white/10"
          >
            →
          </button>
        </div>

        {/* Grid */}

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => (
              <div
                key={d}
                className="pb-2 text-center text-xs font-medium tracking-[0.10em] text-[#a7b0a2] uppercase"
              >
                {d}
              </div>
            ))}

            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const trained = trainedDays.has(day);
              const isToday = isCurrentMonth && day === today.getDate();

              return (
                <div
                  key={day}
                  className={`flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition ${
                    trained
                      ? "bg-[#c6f135] font-semibold text-[#12160f]"
                      : isToday
                        ? "border border-[#c6f135]/60 text-[#f3f6ef]"
                        : "bg-white/5 text-[#a7b0a2]"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}

        <div className="mt-4 flex items-center gap-5 text-xs text-[#a7b0a2]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#c6f135]" /> Trained
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#c6f135]/60" /> Today
          </span>
        </div>
      </div>
    </div>
  );
}