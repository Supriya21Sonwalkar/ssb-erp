import api from "./api";

const BASE_URL = "/academic-management/academic-years";

const academicYearApi = {
    // Get Active Academic Years
    getAll: (params = {}) => api.get(BASE_URL, { params }),

    // Get Single Academic Year
    getById: (id) => api.get(`${BASE_URL}/${id}`),

    // Create Academic Year
    create: (data) => api.post(BASE_URL, data),

    // Update Academic Year
    update: (id, data) => api.put(`${BASE_URL}/${id}`, data),

    // Get Inactive Academic Years
    getInactive: () => api.get(`${BASE_URL}/inactive`),

    // Move Academic Year to Inactive
    delete: (id) => api.delete(`${BASE_URL}/${id}`),

    // Restore Academic Year
    restore: (id) => api.patch(`${BASE_URL}/${id}/restore`),
};

export default academicYearApi;