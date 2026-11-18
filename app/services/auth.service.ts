const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function register(data: {email: string; name: string; phone: string; password: string}) {

    const endpoint = '/auth/register';
    const response = await fetch(BACKEND_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function login(data: {email: string; password: string}) {

    const endpoint = '/auth/login';
    const response = await fetch(BACKEND_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if(!response.ok) {
        throw new Error (result.message);
    }

    return result;
}