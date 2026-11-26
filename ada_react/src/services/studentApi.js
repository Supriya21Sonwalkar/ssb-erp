import api from "./api";

const BASE_URL = "/student-management/students";

const studentApi = {

    // ==========================================
    // CRUD
    // ==========================================

    getAll() {
        return api.get(BASE_URL);
    },

    getById(id) {
        return api.get(`${BASE_URL}/${id}`);
    },

    create(data) {
        return api.post(BASE_URL, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    update(id, data) {
        return api.post(`${BASE_URL}/${id}?_method=PUT`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    delete(id) {
        return api.delete(`${BASE_URL}/${id}`);
    },

    restore(id) {
        return api.put(`${BASE_URL}/${id}/restore`);
    },

    getInactive() {
        return api.get(`${BASE_URL}/inactive`);
    },

    // ==========================================
    // Dropdowns
    // ==========================================

    getDropdowns() {
        return api.get(`${BASE_URL}/dropdowns`);
    },

    // ==========================================
    // Search
    // ==========================================

    search(keyword) {
        return api.get(`${BASE_URL}/search`, {
            params: {
                keyword,
            },
        });
    },

    // ==========================================
    // Validation
    // ==========================================

    checkAdmissionNumber(admission_no) {
        return api.post(
            `${BASE_URL}/check-admission-number`,
            {
                admission_no,
            }
        );
    },

    checkStudentCode(student_code) {
        return api.post(
            `${BASE_URL}/check-student-code`,
            {
                student_code,
            }
        );
    },

    // ==========================================
    // Class / Section
    // ==========================================

    getStudentsByClass(classId) {
        return api.get(
            `${BASE_URL}/class/${classId}`
        );
    },

    getStudentsBySection(sectionId) {
        return api.get(
            `${BASE_URL}/section/${sectionId}`
        );
    },

    getSectionsByClass(classId) {
        return api.get(
            `${BASE_URL}/sections-by-class/${classId}`
        );
    },

};

export default studentApi;