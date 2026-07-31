import api from "./api";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getConsultationByAppointment(appointmentId: string) {
  const response = await api.get(`/consultations/appointment/${appointmentId}`, authHeader());
  return response.data;
}

export async function createConsultation(data: {
  appointmentId: string;
  symptoms: string;
  examinationFindings: string;
  diagnosis: string;
  treatmentPlan: string;
  followUpDate?: string;
}) {
  const response = await api.post("/consultations", data, authHeader());
  return response.data;
}

export async function updateConsultation(id: string, data: {
  symptoms: string;
  examinationFindings: string;
  diagnosis: string;
  treatmentPlan: string;
  followUpDate?: string;
  status?: "Draft" | "Completed";
}) {
  const response = await api.put(`/consultations/${id}`, data, authHeader());
  return response.data;
}



export async function deleteConsultation(id: string) {
    const response = await api.delete(
        `/consultations/${id}`,
        authHeader()
    );

    return response.data;
}