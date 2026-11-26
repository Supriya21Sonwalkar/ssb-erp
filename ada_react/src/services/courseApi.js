import api from "./api";

const BASE_URL = "/fees/courses";

const courseApi = {

    // Get all courses
    getAll: (params = {}) =>
        api.get(BASE_URL, {
            params,
        }),

    // Get single course
    getById: (id) =>
        api.get(`${BASE_URL}/${id}`),

    // Create course
    create: (data) =>
        api.post(BASE_URL, data),

    // Update course
    update: (id, data) =>
        api.put(`${BASE_URL}/${id}`, data),

    // Delete course
    delete: (id) =>
        api.delete(`${BASE_URL}/${id}`),

    // Activate / Deactivate
    toggleStatus: (id) =>
        api.put(`${BASE_URL}/${id}/toggle-status`),

};

export default courseApi;