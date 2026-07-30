import axios from 'axios';

const api = axios.create({
    baseURL:"https://clinic-management-erp.onrender.com/api",
    
    withCredentials:true,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("accessToken");

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },

     (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh for 401 errors, not on the refresh endpoint itself,
        // and only once per request (prevent infinite loop)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login')
        ) {
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the backend refresh endpoint (refresh token is in HttpOnly cookie)
                const response = await axios.post(
                    "https://clinic-management-erp.onrender.com/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                // Save the new token
                localStorage.setItem("accessToken", newAccessToken);

                // Update the failed request's auth header
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process any queued requests with the new token
                processQueue(null, newAccessToken);

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed — the refresh token is also invalid/expired
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Log cleanly for demo debugging without cluttering UI
        console.error("API Error:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default api;