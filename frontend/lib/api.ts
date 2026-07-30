import axios from 'axios';

const api = axios.create({
    baseURL:"https://clinic-management-erp.onrender.com/api",
    
    withCredentials:true,
});


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
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        
        // Log cleanly for demo debugging without cluttering UI
        console.error("API Error:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default api;