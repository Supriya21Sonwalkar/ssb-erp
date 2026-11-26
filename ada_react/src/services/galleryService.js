import api from "./api";

export const getGallery = async () => {
    const response = await api.get("/react/gallery");
    return response.data;
};