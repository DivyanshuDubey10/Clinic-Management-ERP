import axios from 'axios';

const api = axios.create({
    baseURL:"https://clinic-management-erp.onrender.com/api",
    headers:{
        "Content-Type": "application/json"
    }
});

export default api