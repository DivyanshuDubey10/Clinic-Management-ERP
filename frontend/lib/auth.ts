import api from "./api";

export async function registerUser(data :{
    name:string;
    email:string;
    password:string;
    phone:string;
    role:string;
    specialization?:string;
}){
    const response = await api.post("/auth/register",data);
    return response.data;
}

export async function loginUser(data:{
    email:string;
    password:string;
}){
    const response = await api.post("/auth/login",data);
    return response.data
}

export async function getProfile(){
    const token = localStorage.getItem("accessToken")

    const response = await api.get("/auth/profile",{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })

    return response.data
}

export async function updateProfile(data:{
    name:string;
    phone:string;
    specialization?:string;
    consultationHours?:string;
}){
    const token = localStorage.getItem("accessToken")

    const response = await api.put("/auth/profile",data,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });

    return response.data;
}

export async function verifyEmailOTP(data: {
    email: string;
    otp: string;
}) {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
}

export async function resendVerificationOTP(data: {
    email: string;
}) {
    const response = await api.post("/auth/resend-verification", data);
    return response.data;
}
