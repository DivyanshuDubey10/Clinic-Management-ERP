import api from "./api";

function authHeader(){
    const token = localStorage.getItem('accessToken');

    return{
        Authorization: `Bearer ${token}`
    };
}

//create Appointment
export async function createAppointment(data:{
    patientId:string;
    doctorId:string;
    appointmentDate:string;
    duration: number;
    appointmentType: "Walk-in" | "Online"| "Follow-up";
    reasonForVisit:string;
    consultationRoom?:string;
    status?:"booked" | "checked-in" | "in-progress" | "completed" | "cancelled" | "no-show"
}){
    return api.post('/appointments', data, {
        headers: authHeader(),
    })
}


//get appointments
export async function getAppointments(
    doctorId?:string,
    startDate?:string,
    endDate?:string
){
    const response = await api.get('/appointments',{
        params:{
            doctorId,
            startDate,
            endDate,
        },
        headers: authHeader()
    })

    return response.data
}


//Get one appointmtn
export async function getAppointment(id:string){
    const response = await api.get(`/appointments/${id}`,{
        headers: authHeader(),
    });

    return response
}


//update Appointment
export async function updateAppointment(
    id:string,
    data:Partial<{
        doctorId:string;
        patientId:string;
        appointmentDate:string;
        duration:number;
        appointmentType:  "Walk-in" | "Online" | "Follow-up";
        reasonForVisit:string;
        consultationRoom:string;
        status: "booked" | "checked-in" | "in-progress" | "completed" | "cancelled" | "no-show";
    }>
){
    const response = await api.put(`/appointments/${id}`, data,{
        headers: authHeader()
    })

    return response.data
}


//delete Appointment
export async function deleteAppointment(id:string){
    const response = await api.delete(`/appointments/${id}`,{
        headers: authHeader()
    })

    return response.data
}


//Available slots
export async function getAvailableSlots(
    doctorId: string,
    date: string,
    excludeAppointmentId?: string
){
    const response = await api.get("/appointments/available-slots",{
        params:{
            doctorId,
            date,
            excludeAppointmentId,
        },
        headers: authHeader(),
    })

    return response.data
}


// Queue
export async function getQueue(doctorId:string){
    const response = await api.get(`/appointments/queue/${doctorId}`,{
        headers: authHeader()
    })

    return response.data
}

//waitlist
export async function getWaitlist(
    doctorId: string,
    date: string
){
    const response = await api.get("/appointments/waitlist",{
        params:{
            doctorId,
            date
        },
        headers: authHeader(),
    });

    return response.data
}



//add to waitlist
export async function addToWaitlist(data:{
    patientId:string;
    doctorId:string;
    requestedDate:string;
    notes?:string;
    status?:"Waiting"|"Assigned"| "Cancelled"
}){
    const response = await api.post("/appointments/waitlist", data,{
        headers: authHeader(),
    })

    return response.data
}



//Bulk reminder
export async function triggerReminders(){
    const response = await api.post("/appointments/reminders",{},{
        headers: authHeader()
    })

    return response.data
}
