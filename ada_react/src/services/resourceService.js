import api from "./api";

export const getResources = async () => {
    const response = await api.get("/react/resources");
    return response.data.resources;
};