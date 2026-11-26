import api from "./api";

export const submitEnquiry = async (formData) => {
    const response = await api.post("/react/contact", formData);
    return response.data;
};