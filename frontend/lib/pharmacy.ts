import api from "./api";

function authHeader(){
    const token = localStorage.getItem("accessToken")

    return{
        Authorization: `Bearer ${token}`
    }
}

export async function getMedicines(){
    const response = await api.get("/pharmacy/medicines")

    return response.data
}


// add medicine
export async function addMedicine(data:any){
    const response = await api.post("/pharmacy/medicines", data)

    return response.data
}


// record purchase
export async function recordPurchase(data: any){
    const response = await api.post("/pharmacy/purchase", data)

    return response.data
}


//dispense prescription
export async function dispensePrescription( prescriptionId: string){
    const response = await api.post(
        `/pharmacy/dispense/${prescriptionId}`,
        {}
    )

    return response.data
}


export async function getPrescriptions(params?: any){
    const response = await api.get("/prescriptions", {
        params,
        ...authHeader(),
    });

    return response.data
}


//get alerts
export async function getAlerts(){
    const response = await api.get("/pharmacy/alerts")

    return response.data
}


export const deleteMedicine = async (id: string) => {
    const response = await api.delete(`/pharmacy/medicines/${id}`);
    return response.data;
}



export async function getMedicineById(id: string) {
    const response = await api.get(`/pharmacy/medicines/${id}`);
    return response.data;
}

export async function updateMedicine(id: string, data: any) {
    const response = await api.put(`/pharmacy/medicines/${id}`, data);
    return response.data;
}