import api from "./api";

export async function getDashboard(){
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/dashboard",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}


export async function getDoctorDashboard(){
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/dashboard/doctor",{
        headers:{
            Authorization :`Bearer ${token}`
        }
    })

    return response.data
}