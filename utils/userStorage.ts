import { UserData } from '../types';

const USERS_KEY = 'ca_journey_users';
const CURRENT_USER_KEY = 'ca_journey_current_user';

interface UserCredential {
    username: string;
    passwordHash: string; // Stored as plain text for simplicity in this local version
}

export const getStoredUsers = (): UserCredential[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

export const saveUserCredential = (user: UserCredential) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

export const getUserData = (username: string): UserData | null => {
    const data = localStorage.getItem(`ca_data_${username}`);
    return data ? JSON.parse(data) : null;
};

export const saveUserData = (username: string, data: UserData) => {
    localStorage.setItem(`ca_data_${username}`, JSON.stringify(data));
};
