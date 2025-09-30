import api from "../api";

export const getDashboard = async () => {
    const response = await api.get("/dashboard", {
        withCredentials: true,
    });
    return response.data;
};
