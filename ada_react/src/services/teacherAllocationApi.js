import api from "./api";

const BASE_URL = "/academic-management/teacher-allocations";

const teacherAllocationApi = {

    // ===============================
    // Teacher Allocation CRUD
    // ===============================

    getAll() {
        return api.get(BASE_URL);
    },

    get(id) {
        return api.get(`${BASE_URL}/${id}`);
    },

    create(data) {
        return api.post(BASE_URL, data);
    },

    update(id, data) {
        return api.put(`${BASE_URL}/${id}`, data);
    },

    delete(id) {
        return api.delete(`${BASE_URL}/${id}`);
    },

    restore(id) {
        return api.put(`${BASE_URL}/${id}/restore`);
    },

    inactive() {
        return api.get(`${BASE_URL}/inactive`);
    },

    // ===============================
    // Dropdown APIs
    // ===============================

    /**
     * Get Subjects according to selected Class
     */
    getSubjectsByClass(classId) {
        return api.get(`${BASE_URL}/class/${classId}/subjects`);
    },

    /**
     * Get Teachers
     */
    getTeachers() {
        return api.get(`${BASE_URL}/teachers`);
    },

};

export default teacherAllocationApi;