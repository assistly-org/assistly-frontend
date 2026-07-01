import axios from 'axios';

let currentAccessToken: string | null = null;

export const setAxiosToken = (token: string | null) => {
    currentAccessToken = token;
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", 
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (currentAccessToken && config.headers) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    
    // ⚡ THE FIX: Check if we have a user proxy in storage
    const likelyHasSession = typeof window !== 'undefined' && localStorage.getItem('user') !== null;

    if (
        error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/auth/refresh' &&
        likelyHasSession // ⚡ Only retry if we think they have a session
    ) {
        originalRequest._retry = true; 

        try {
            const refreshResponse = await api.post('/auth/refresh');
            const newAccessToken = refreshResponse.data.access_token;
            
            setAxiosToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
            
        } catch (refreshError) {
            setAxiosToken(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                window.location.replace('/login');
            }
            return Promise.reject(refreshError);
        }
    }
    
    // If it's a 401 and they DON'T have a session, it just falls through to here naturally
    return Promise.reject(error);
});