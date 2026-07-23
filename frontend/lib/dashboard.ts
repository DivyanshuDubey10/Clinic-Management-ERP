import api from "./api";

export async function getDashboard(){
    const token = localStorage.getItem("token");

    return api.get("/dashboard",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}