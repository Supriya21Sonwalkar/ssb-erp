import api from "./api";

export const submitBooking = async (formData) => {
    const response = await api.post("/react/booking", formData);
    return response.data;
};
