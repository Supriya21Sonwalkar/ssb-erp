import api from "./api";

const subjectApi = {
    getAll: async () => {
        const response = await api.get("/academic-management/subjects");
        return response.data;
    },

    getInactive: async () => {
        const response = await api.get("/academic-management/subjects/inactive");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/academic-management/subjects/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post("/academic-management/subjects", data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/academic-management/subjects/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/academic-management/subjects/${id}`);
        return response.data;
    },

    restore: async (id) => {
        const response = await api.put(`/academic-management/subjects/${id}/restore`);
        return response.data;
    },
};

export default subjectApi;