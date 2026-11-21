"use client";

import Link from "next/link";
import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addExercise,
  deleteExercise,
  Exercise,
  getByDay,
  Routine,
  updateExercise,
  updateRoutineTitle,
} from "@/app/services/routine.service";
import { createWorkoutLog } from "@/app/services/worklog.service";

const validDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function DayRoutineContent() {

  const router = useRouter();
  const params = useParams();
  const rawDay = params?.day;
  const day = (Array.isArray(rawDay) ? rawDay[0] : rawDay || "").toLowerCase();

  const [token, setToken] = useState<string | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form to add an exercise

  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  // Exercise editing

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editReps, setEditReps] = useState("");
  const [editWeight, setEditWeight] = useState("");

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  const [markingDone, setMarkingDone] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  }, [router]);

  const loadRoutine = useCallback(
    async (authToken: string, currentDay: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getByDay(currentDay, authToken);
        setRoutine(data);
        setExercises(data?.exercises ?? []);
      } catch (err) {
        if (err instanceof Error && err.message === "Unauthorized") {
          handleUnauthorized();
          return;
        }
        setError(
          err instanceof Error ? err.message : "Error while loading your routine"
        );
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/");
      return;
    }

    if (!validDays.includes(day)) {
      setError("Invalid day");
      setLoading(false);
      return;
    }

    setToken(storedToken);
    loadRoutine(storedToken, day);
  }, [day, loadRoutine, router]);

  const handleAddExercise = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim()) return;

    const parsedSets = Number(sets);
    const parsedReps = Number(reps);
    const parsedWeight = weight.trim() === "" ? null : Number(weight.replace(",", "."));

    setSaving(true);
    setError(null);
    try {
      const created = await addExercise(
        day,
        {
          name: name.trim(),
          sets: parsedSets,
          reps: parsedReps,
          weight: parsedWeight,
        },
        token
      );

      if (created) {
        setExercises((prev) => [...prev, created]);
      } else {
        await loadRoutine(token, day);
      }

      setName("");
      setSets("3");
      setReps("10");
      setWeight("");
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Error while adding exercise"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setEditName(exercise.name);
    setEditSets(String(exercise.sets));
    setEditReps(String(exercise.reps));
    setEditWeight(exercise.weight !== null ? String(exercise.weight) : "");
  };

  const handleUpdateExercise = async (exerciseId: string) => {
    if (!token || !editName.trim()) return;

    const parsedSets = Number(editSets);
    const parsedReps = Number(editReps);
    const parsedWeight =
      editWeight.trim() === "" ? null : Number(editWeight.replace(",", "."));

    setError(null);
    try {
      const updated = await updateExercise(
        exerciseId,
        {
          name: editName.trim(),
          sets: parsedSets,
          reps: parsedReps,
          weight: parsedWeight,
        },
        token
      );

      setExercises((prev) =>
        prev.map((item) =>
          item.id === exerciseId
            ? updated ?? {
              ...item,
              name: editName.trim(),
              sets: parsedSets,
              reps: parsedReps,
              weight: parsedWeight,
            }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Error while updating exercise"
      );
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!token) return;

    setError(null);
    try {
      await deleteExercise(exerciseId, token);
      setExercises((prev) => prev.filter((item) => item.id !== exerciseId));
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Error while deleting exercise"
      );
    }
  };

  const handleUpdateTitle = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !titleInput.trim()) return;

    setError(null);
    try {
      const updated = await updateRoutineTitle(day, token, titleInput.trim());
      setRoutine((prev) =>
        prev
          ? { ...prev, title: updated.title }
          : { ...updated, exercises }
      );
      setIsEditingTitle(false);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Error while updating title"
      );
    }
  };

  const handleMarkDone = async () => {
    if (!token || !routine?.id) return;

    setMarkingDone(true);
    setError(null);
    try {
      await createWorkoutLog(routine.id, token);
      setWorkoutDone(true);
      setTimeout(() => setWorkoutDone(false), 3000);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Error while saving your workout"
      );
    } finally {
      setMarkingDone(false);
    }
  };

  const dayLabel = day ? day.charAt(0).toUpperCase() + day.slice(1) : "";

  return (
    <div className="flex min-h-dvh flex-1 bg-[#10140f] font-sans text-[#f3f6ef]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 sm:px-10 lg:py-14">

        {/* Header */}

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/home"
            className="text-sm text-[#a7b0a2] transition hover:text-white"
          >
            Back to split
          </Link>
          <span className="text-xs font-semibold tracking-[0.15em] text-[#c6f135] uppercase">
            {dayLabel}
          </span>
        </header>

        {/* Day's title */}

        <section className="mt-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#c6f135] uppercase">
            Routine
          </p>

          {isEditingTitle ? (
            <form
              onSubmit={handleUpdateTitle}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Push Day, Upper Body..."
                autoFocus
                required
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-2xl font-semibold text-[#f3f6ef] focus:border-[#c6f135] focus:outline-none sm:text-3xl"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#c6f135] px-4 py-2 text-xs font-semibold text-[#12160f]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs text-[#a7b0a2] hover:text-white"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-semibold tracking-tight">
                {routine?.title || `${dayLabel} Workout`}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setTitleInput(routine?.title || "");
                  setIsEditingTitle(true);
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#a7b0a2] transition hover:border-white/25 hover:text-white"
              >
                Edit title
              </button>
            </div>
          )}
        </section>

        {/* Error message */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Form to add an exercise */}

        <form
          onSubmit={handleAddExercise}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <h2 className="text-sm font-medium tracking-[0.10em] text-[#a7b0a2] uppercase">
            Add Exercise
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-12">
            <input
              type="text"
              placeholder="Exercise name (e.g. Bench Press)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-[#10140f] px-4 py-2.5 text-sm text-[#f3f6ef] placeholder-[#a7b0a2]/60 focus:border-[#c6f135] focus:outline-none sm:col-span-5"
            />
            <input
              type="number"
              min={1}
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-[#10140f] px-3 py-2.5 text-sm text-[#f3f6ef] focus:border-[#c6f135] focus:outline-none sm:col-span-2"
            />
            <input
              type="number"
              min={1}
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-[#10140f] px-3 py-2.5 text-sm text-[#f3f6ef] focus:border-[#c6f135] focus:outline-none sm:col-span-2"
            />
            <input
              type="number"
              step="0.5"
              min={0}
              placeholder="kg (optional)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#10140f] px-3 py-2.5 text-sm text-[#f3f6ef] placeholder-[#a7b0a2]/60 focus:border-[#c6f135] focus:outline-none sm:col-span-3"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#c6f135] px-5 py-2.5 text-sm font-semibold text-[#12160f] transition hover:brightness-105 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Exercise"}
            </button>
          </div>
        </form>

        {/* Exercises list */}

        <section className="mt-8">
          <h2 className="mb-4 text-sm font-medium tracking-[0.10em] text-[#a7b0a2] uppercase">
            Exercises ({exercises.length})
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-[#a7b0a2]">
              Loading routine...
            </div>
          ) : exercises.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-[#a7b0a2]">
              No exercises for {dayLabel} yet. Add one above.
            </div>
          ) : (
            <div className="grid gap-3">
              {exercises.map((exercise) => {
                const isEditing = editingId === exercise.id;

                return (
                  <div
                    key={exercise.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20"
                  >
                    {isEditing ? (
                      <div className="grid gap-3 sm:grid-cols-12 sm:items-center">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-xl border border-white/15 bg-[#10140f] px-3 py-2 text-sm text-[#f3f6ef] sm:col-span-4"
                        />
                        <input
                          type="number"
                          min={1}
                          value={editSets}
                          onChange={(e) => setEditSets(e.target.value)}
                          className="rounded-xl border border-white/15 bg-[#10140f] px-3 py-2 text-sm text-[#f3f6ef] sm:col-span-2"
                        />
                        <input
                          type="number"
                          min={1}
                          value={editReps}
                          onChange={(e) => setEditReps(e.target.value)}
                          className="rounded-xl border border-white/15 bg-[#10140f] px-3 py-2 text-sm text-[#f3f6ef] sm:col-span-2"
                        />
                        <input
                          type="number"
                          step="0.5"
                          min={0}
                          placeholder="kg"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="rounded-xl border border-white/15 bg-[#10140f] px-3 py-2 text-sm text-[#f3f6ef] sm:col-span-2"
                        />
                        <div className="flex justify-end gap-2 sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateExercise(exercise.id)}
                            className="rounded-lg bg-[#c6f135] px-3 py-1.5 text-xs font-semibold text-[#12160f]"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#a7b0a2] hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-medium text-[#f3f6ef]">
                            {exercise.name}
                          </p>
                          <p className="mt-1 text-sm text-[#a7b0a2]">
                            <span className="font-semibold text-[#c6f135]">
                              {exercise.sets}
                            </span>{" "}
                            sets x{" "}
                            <span className="font-semibold text-[#c6f135]">
                              {exercise.reps}
                            </span>{" "}
                            reps
                            {exercise.weight !== null && (
                              <>
                                {" "}
                                ·{" "}
                                <span className="font-medium text-[#f3f6ef]">
                                  {exercise.weight} kg
                                </span>
                              </>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(exercise)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-[#f3f6ef] transition hover:border-white/25 hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Mark day as done */}

        {!loading && routine?.id && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleMarkDone}
              disabled={markingDone}
              className="rounded-xl bg-[#c6f135] px-6 py-3 text-sm font-semibold text-[#12160f] transition hover:brightness-105 disabled:opacity-50"
            >
              {markingDone
                ? "Saving..."
                : workoutDone
                  ? "Done! ✓"
                  : "Mark day as done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DayRoutinePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-1 items-center justify-center bg-[#10140f] font-sans text-sm text-[#a7b0a2]">
          Loading routine...
        </div>
      }
    >
      <DayRoutineContent />
    </Suspense>
  );
}