import api from "./api";

function authHeader(){
    const token = localStorage.getItem("accessToken")
 
    return{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
}


export async function getLabOrders (params?: any){
    const response = await api.get("/lab-orders", {
        params,
        ...authHeader()
    })
    return response.data
}


export async function getLabOrder(id: string){
    const response = await api.get(`/lab-orders/${id}`, authHeader())

    return response.data
}


export async function createLabOrder(data: any){
    const response = await api.post(
        "lab-orders",
        data,
        authHeader()
    );
    return response.data
}


export async function updateLabOrder(id:string, data:any){
    const response = await api.put(
        `/lab-orders/${id}`,
        data,
        authHeader()
    );
    return response.data
}