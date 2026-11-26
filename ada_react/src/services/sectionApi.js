import api from "./api";

const sectionApi = {

    getAll() {
        return api.get("/academic-management/sections");
    },

    getByClass(classId) {
        return api.get(`/academic-management/sections/class/${classId}`);
    },

    getInactive() {
        return api.get("/academic-management/sections-inactive");
    },

    getById(id) {
        return api.get(`/academic-management/sections/${id}`);
    },

    create(data) {
        return api.post("/academic-management/sections", data);
    },

    update(id, data) {
        return api.put(`/academic-management/sections/${id}`, data);
    },

    delete(id) {
        return api.delete(`/academic-management/sections/${id}`);
    },

    restore(id) {
        return api.put(`/academic-management/sections/${id}/restore`);
    },

};

export default sectionApi;