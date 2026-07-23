import api from "./api";

function authHeader(){
    const token = localStorage.getItem('token');

    return{
        Authorization: `Bearer ${token}`
    };
}

//create Appointment
export async function createAppointment(data:{
    patientId:string;
    doctorId:string;
    date:string;
    timeslot:string;
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
    return api.get('/appointments',{
        params:{
            doctorId,
            startDate,
            endDate,
        },
        headers: authHeader()
    })
}


//Get one appointmtn
