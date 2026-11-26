import api from "./api";

const BASE_URL = "/employee";

const employeeApi = {

    // ==========================
    // Employee List
    // ==========================

    getAll() {
        return api.get(BASE_URL);
    },

    getInactive() {
        return api.get(`${BASE_URL}/inactive`);
    },

    getById(id) {
        return api.get(`${BASE_URL}/${id}`);
    },

    getEmployeeList() {
        return api.get(`${BASE_URL}/list`);
    },

    // ==========================
    // Aadhaar Verification
    // ==========================

    checkAadhaar(data) {
        return api.post(`${BASE_URL}/check-aadhaar`, data);
    },

    // ==========================
    // Employee CRUD
    // ==========================

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

    // ==========================
    // Roles
    // ==========================

    getRoles() {
        return api.get("/roles");
    },

};

export default employeeApi;