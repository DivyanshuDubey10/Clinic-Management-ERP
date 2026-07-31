import api from "./api";

export async function globalSearch(query: string) {
  const response = await api.get("/search", {
    params: { q: query },
  });

  return response.data;
}