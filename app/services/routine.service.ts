const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number | null;
}

export interface Routine {
    id: string;
    dayOfWeek: string;
    title: string;
    exercises: Exercise[];
}

export interface CreateExerciseInput {
    name: string;
    sets: number;
    reps: number;
    weight?: number | null;
}
  
export interface UpdateExerciseInput {
    name?: string;
    sets?: number;
    reps?: number;
    weight?: number | null;
}

