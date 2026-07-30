import api from "./api";

function authHeader(){
    return{
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
}

export async function getDoctors(){
    const response = await api.get("/staff",{
        params:{
            role:"doctor",
        },
        headers: authHeader(),
    });

    return response.data
}