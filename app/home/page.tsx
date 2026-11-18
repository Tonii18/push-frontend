"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Athlete");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          setUserName(parsedUser.name);
        }
      } catch (e) {
        console.error("Error al leer el usuario del localStorage", e);
      }
    }

    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Intl.DateTimeFormat("en-US", options).format(new Date());
    setCurrentDay(today);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="flex min-h-dvh flex-1 bg-[#10140f] font-sans text-[#f3f6ef]"> 
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 sm:px-10 lg:py-14">
        
        {/* Header */}

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c6f135] text-[#12160f]">
              <BarbellIcon />
            </span>
            <span className="text-sm font-semibold tracking-[0.28em]">PUSH</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#a7b0a2] transition hover:text-white"
          >
            Sign out
          </button>
        </header>

        {/* Hello and current day */}

        <section className="mt-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#c6f135] uppercase">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Welcome back, {userName}.
          </h1>
          <p className="mt-2 text-base text-[#a7b0a2]">
            Today is <span className="font-medium text-[#f3f6ef]">{currentDay}</span>. Select a day to check or log your routine.
          </p>
        </section>

        {/* Buttons for each day of the week */}

        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-[0.15em] text-[#a7b0a2] uppercase mb-4">
            Weekly Training Split
          </h2>
          <div className="grid gap-3">
            {daysOfWeek.map((day) => {
              const isToday = day.label.toLowerCase() === currentDay.toLowerCase();
              
              return (
                <Link
                  key={day.id}
                  href={`/routine/${day.id}`}
                  className={`group flex items-center justify-between rounded-2xl border p-5 transition ${
                    isToday
                      ? "border-[#c6f135]/40 bg-[#c6f135]/10 hover:border-[#c6f135]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition ${
                        isToday
                          ? "bg-[#c6f135] text-[#12160f]"
                          : "bg-white/10 text-white group-hover:bg-[#c6f135] group-hover:text-[#12160f]"
                      }`}
                    >
                      {day.label.slice(0, 3).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-base font-medium">{day.label}</p>
                      <p className="text-xs text-[#a7b0a2]">
                        {isToday ? "Today's scheduled session" : "Tap to view routine"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#a7b0a2] transition group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

function BarbellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.2 7.2h2.1V5.4h1.7v9.2H4.3v-1.8H2.2V7.2Zm13.8 0h2V12h-2v2.6h-1.7V5.4h1.7v1.8ZM6.6 9.1h6.8v1.8H6.6V9.1Z"
        fill="currentColor"
      />
    </svg>
  );
}