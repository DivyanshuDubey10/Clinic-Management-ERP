import api from "./api";

function authHeader(){
    const token = localStorage.getItem("accessToken")

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




export async function getMyAppointment(){
    const response = await api.get("/patient-portal/appointments", authHeader())

    return response.data
}


export async function cancelAppointment(id:string) {
    const response = await api.put(
        `/patient-portal/appointments/${id}/cancel`,
        {},
        authHeader()
    )

    return response.data
}



export async function getMyPrescriptions(){
    const response = await api.get("/patient-portal/prescriptions",
        authHeader()
    )

    return response.data
}



export async function getMyLabOrders(){
    const response = await api.get(
        "/patient-portal/lab-orders",
        authHeader()
    )

    return response.data
}


export async function downloadPrescription(id: string){
    const response = await api.get(`/patient-portal/prescriptions/${id}/download`, {
        ...authHeader(),
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(url, '_blank');
}


export async function downloadLabReports(id:string){
    const response = await api.get(`/patient-portal/lab-orders/${id}/download`, {
        ...authHeader(),
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(url, '_blank');
}


export async function getMyInvoices(){
    const response = await api.get(
        "/patient-portal/invoices",
        authHeader()
    )

    return response.data
}


export async function getInvoice(id:string) {
    const response = await api.get(
        `/patient-portal/invoices/${id}`,
        authHeader()
    );

    return response.data
}


export async function createRazorpayOrder(id:string){
    const response = await api.post(
        `/patient-portal/invoices/${id}/razorpay-order`,
        {},
        authHeader()
    );

    return response.data
}


export async function verifyPayment(id:string, data:any) {
    const response = await api.post(
        `/patient-portal/invoices/${id}/verify-payment`,
         data,
         authHeader()
    )

    return response.data
}