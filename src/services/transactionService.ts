import api from "../api";

interface TransactionParams {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
}

export const getTransactions = async (params: TransactionParams = {}) => {
    const response = await api.get("/transactions", {
        params,
        withCredentials: true,
    });
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get("/transactions/analytics/data", {
        withCredentials: true,
    });
    return response.data;
}

export const getTransactionById = async (id: string | number) => {
    const response = await api.get(`/transactions/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export const createTransaction = async (payload: any) => {
    const response = await api.post("/transactions", payload, {
        withCredentials: true,
    });
    return response.data;
};

export const updateTransaction = async (id: string | number, payload: any) => {
    const response = await api.post(`/transactions/${id}`, payload, {
        withCredentials: true,
        params: {
            _method: "PUT",
        },
    });
    return response.data;
};

export const deleteTransaction = async (id: string | number) => {
    const response = await api.delete(`/transactions/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export const exportTransaction = async (params: { start_date: string; end_date: string }) => {
    try {
        const response = await api.get("/transactions/export/data", {
            params,
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const now = new Date();
        const fileName = `transactions_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.xlsx`;
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error("Failed to export transactions");
    }
};