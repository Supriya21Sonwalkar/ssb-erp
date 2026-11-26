import api from "./api";

export const getDesignations = async () => {
    const response = await api.get("/designations");
    return response.data;
};