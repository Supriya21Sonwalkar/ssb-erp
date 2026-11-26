import api from "./api";

const BASE_URL = "/academic-management/classes";

const classApi = {
    // Active Classes
    getAll: () => api.get(BASE_URL),

    // Single Class
    getById: (id) => api.get(`${BASE_URL}/${id}`),

    // Create
    create: (data) => api.post(BASE_URL, data),

    // Update
    update: (id, data) => api.put(`${BASE_URL}/${id}`, data),

    // Delete (Soft Delete)
    delete: (id) => api.delete(`${BASE_URL}/${id}`),

    // Inactive Classes
    getInactive: () => api.get(`${BASE_URL}/inactive/list`),

    // Restore
    restore: (id) => api.put(`${BASE_URL}/${id}/restore`),
};

export default classApi;