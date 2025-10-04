import api from "../api";

export const getSettings = async () => {
    const response = await api.get("/settings", {
        withCredentials: true,
    });
    return response.data;
};