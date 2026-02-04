import { UserData } from '../types';

const USERS_KEY = 'ca_journey_users';
const CURRENT_USER_KEY = 'ca_journey_current_user';

interface UserCredential {
    username: string;
    passwordHash: string; // Stored as plain text for simplicity in this local version
}

export const signupUser = async (user: UserCredential): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'signup', ...user }),
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const loginUser = async (user: UserCredential): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', ...user }),
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const setCurrentUserLocal = (username: string | null) => {
    if (username) {
        localStorage.setItem(CURRENT_USER_KEY, username);
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

export const getCurrentUserLocal = (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
};

export const getUserData = async (username: string): Promise<UserData | null> => {
    const response = await fetch(`/api/data?username=${encodeURIComponent(username)}`);
    return response.json();
};

export const saveUserData = async (username: string, data: UserData): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/data?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};
