import api from "./api";

function authHeader(){
    return{
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
}

export async function getAvailability(doctorId: string){
    const response = await api.get(`/availability/${doctorId}`,{
        headers: authHeader()
    })

    return response.data
}


export async function setAvailability(data: any){
    const response = await api.post(`/availability`, data, {
        headers: authHeader()
    })

    return response.data
}


export async function getAllAvailability(){
    const response = await api.get("/availability",{
        headers: authHeader()
    })

    return response.data
}

