import api from "./api";

function getAuthHeader(){
    const token = localStorage.getItem('token');

    return{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
}

export async function getPatients(){
    const response = await api.get("/patients", getAuthHeader());

    return response.data

}

export async function getPatientId(id:string) {
    const response = await api.get(`/patients/${id}`, getAuthHeader());

    return response.data;
}

export async function createPatient(data:any){
    const response = await api.post('/patients', data, getAuthHeader());

    return response.data;
}

export async function updatePatient(
  id: string,
  data: any
) {
  const response = await api.put(
    `/patients/${id}`,
    data,
    getAuthHeader()
  );

  return response.data;
}


export async function deletePatient(id:string) {
    const response = await api.delete(
        `/patients/${id}`, getAuthHeader()
    )

    return response.data
}