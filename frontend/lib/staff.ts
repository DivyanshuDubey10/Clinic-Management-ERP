import api from './api';

export const getStaff = async () => {
    return api.get('/staff');
};

export const getStaffById = async (id: string) => {
    return api.get(`/staff/${id}`);
};

export const createStaff = async (data: any) => {
    return api.post('/staff', data);
};

export const updateStaff = async (id: string, data: any) => {
    return api.put(`/staff/${id}`, data);
};

export const deleteStaff = async (id: string) => {
    return api.delete(`/staff/${id}`);
};
