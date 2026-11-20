import { ok } from "assert";

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

export async function getByDay(day: string, token: string) {

    const endpoint = `/routines/${day}`;
    const response = await fetch(BACKEND_URL + endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if(response.status == 401) {
        throw new Error('Unauthorized');
    }

    if(!response.ok) {
        throw new Error('Error while loading your routine');
    }

    const text = await response.text();
    
    return text ? JSON.parse(text) : null;
}