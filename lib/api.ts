import axios from 'axios';

// ⚡ 1. The Bridge Variable (In-Memory Token for Axios)
let currentAccessToken: string | null = null;

// Expose a way for your AuthContext to hand the token to Axios
export const setAxiosToken = (token: string | null) => {
    currentAccessToken = token;
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", 
    withCredentials: true, // ⚡ Required to send HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
    // ⚡ Read from our secure memory variable, not localStorage
    if (currentAccessToken && config.headers) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. RESPONSE INTERCEPTOR
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops by ignoring 401s from the refresh endpoint itself
    if (
        error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/auth/refresh'
    ) {
        originalRequest._retry = true; 

        try {
            // Hit the refresh endpoint (Make sure this matches your FastAPI route!)
            const refreshResponse = await api.post('/auth/refresh');
            
            // Grab the brand new access token
            const newAccessToken = refreshResponse.data.access_token;
            
            // ⚡ Update Axios's memory
            setAxiosToken(newAccessToken);

            // Update the failed request and resend it
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
            
        } catch (refreshError) {
            // Refresh failed (cookie expired, user actually logged out)
            setAxiosToken(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                window.location.replace('/login');
            }
            return Promise.reject(refreshError);
        }
    }
    
    return Promise.reject(error);
});