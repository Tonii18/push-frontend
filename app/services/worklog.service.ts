const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface WorkoutLog {
    id: string;
    date: string;
    routineId: string;
}

export async function createWorkoutLog(routineId: string, token: string) {

    const endpoint = '/workout-logs';
    const response = await fetch(BACKEND_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({routineId}),
    });

    if(response.status == 401) {
        throw new Error('Unauthorized');
    }

    if(!response.ok) {
        throw new Error('Error while creating log');
    }

    return response.json();
}

export async function getWorkoutLogs(month: string, token: string) {
    
    const endpoint = `/workout-logs?month=${month}`;
    const response = await fetch(BACKEND_URL + endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if(response.status == 401) {
        throw new Error('Unauthorized');
    }

    if(!response.ok) {
        throw new Error('Error while showing history');
    }

    return response.json();
}