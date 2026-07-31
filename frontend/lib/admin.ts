import api from "./api";

export async function getClinicSettings() {
  const token = localStorage.getItem("accessToken");
  const response = await api.get("/admin/settings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createClinicSetting(data: any) {
  const token = localStorage.getItem("accessToken");
  const response = await api.post("/admin/settings", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateClinicSetting(id: string, data: any) {
  const token = localStorage.getItem("accessToken");
  const response = await api.put(`/admin/settings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
