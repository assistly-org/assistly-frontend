import axios from 'axios';

// 1. Create the base Axios instance
export const api = axios.create({
    // Points to your FastAPI backend (make sure .env.local has NEXT_PUBLIC_API_URL=http://localhost:8000)
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', 
    
    // ⚡ CRITICAL: This tells the browser to automatically attach your HTTP-Only refresh cookie!
    withCredentials: true, 
    
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. REQUEST INTERCEPTOR: The Front Door Bouncer
// Before any request leaves the frontend, attach the Access Token
api.interceptors.request.use((config) => {
    // Next.js safety check: Only access localStorage on the browser (not the server)
    if (typeof window !== 'undefined') { 
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. RESPONSE INTERCEPTOR: The Silent Refresher
// If FastAPI rejects our request, intercept the error before the UI sees it
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // If FastAPI says the token is expired (401) AND we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark it so we don't get stuck in an infinite loop

        try {
            // ⚡ Hit the backend refresh route we built!
            // The browser will automatically send the HTTP-Only cookie with this request.
            const refreshResponse = await api.post('/auth/refresh');

            // Grab the brand new access token
            const newAccessToken = refreshResponse.data.access_token;
            
            // Save it to local storage
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', newAccessToken);
            }

            // Update the original failed request with the new token...
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // ...and resend it! The user will never know it failed the first time.
            return api(originalRequest);
            
        } catch (refreshError) {
            // If the refresh FAILS (e.g., refresh token is blacklisted or expired),
            // it's game over. Wipe the storage and kick them to the login screen.
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
        }
    }
    
    // If it's a normal error (like 400 Bad Request), just pass it to the UI
    return Promise.reject(error);
});