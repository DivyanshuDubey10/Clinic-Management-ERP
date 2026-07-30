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

export async function getPortalDoctors(){
    const response = await api.get("/patient-portal/doctors", authHeader());
    return response.data;
}

export async function getPortalAvailableSlots(doctorId: string, date: string) {
    const response = await api.get("/patient-portal/appointments/available-slots", {
        params: { doctorId, date },
        ...authHeader(),
    });
    return response.data;
}

export async function bookPortalAppointment(data: any) {
    const response = await api.post("/patient-portal/appointments", data, authHeader());
    return response.data;
}

//consultation
export async function getConsultations(params?:any) {
    const response = await api.get("/consultations",{
        params,
        ...authHeader()
    })

    return response.data;
}