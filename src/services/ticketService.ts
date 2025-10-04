import api from "../api";

export const getTickets = async () => {
    const response = await api.get("/tickets", {
        withCredentials: true,
    });
    return response.data.data;
};