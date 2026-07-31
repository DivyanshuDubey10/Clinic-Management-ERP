import api from "./api";

export async function getPerformanceReport(params?: { startDate?: string; endDate?: string }) {
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/reports/performance", {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}
