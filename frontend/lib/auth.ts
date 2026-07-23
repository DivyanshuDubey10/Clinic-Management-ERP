import api from "./api";

export async function registerUser(data :{
    name:string;
    email:string;
    password:string;
    phone:string;
    role:string;
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
    const token = localStorage.getItem("token")
    const response = await api.get("/auth/profile",{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })

    return response.data
}

export async function updateProfile(data:{
    name:string;
    email:string;
    phone:string;
    specialization?:string;
    consultationHours?:string;
}){
    const token = localStorage.getitem("token")

    const response = await api.put("/auth/profile",data,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });

    return response.data;
}