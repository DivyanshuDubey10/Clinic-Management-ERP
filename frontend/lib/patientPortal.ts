import api from "./api";

function authHeader(){
    const token = localStorage.getItem("accessToken");

    return{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
}

export async function getPatientDashboard(){
    const response = await api.get("/patient-portal/dashboard", authHeader())

    return response.data
}


//consultation
export async function getConsultations(params?:any) {
    const response = await api.get("/consultations",{
        params,
        ...authHeader()
    })

    return response.data;
}