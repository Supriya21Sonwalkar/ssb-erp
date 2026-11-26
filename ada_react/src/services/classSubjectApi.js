import api from "./api";

const BASE_URL = "/academic-management/class-subjects";

const classSubjectApi = {

    getAll() {
        return api.get(BASE_URL);
    },

    create(data) {
        return api.post(BASE_URL, data);
    },

    get(id) {
        return api.get(`${BASE_URL}/${id}`);
    },

    edit(id) {
        return api.get(`${BASE_URL}/${id}/edit`);
    },

    update(id, data) {
        return api.put(`${BASE_URL}/${id}`, data);
    },

    delete(id) {
        return api.delete(`${BASE_URL}/${id}`);
    },

    getInactive() {
        return api.get(`${BASE_URL}/inactive`);
    },

    restore(id) {
        return api.put(`${BASE_URL}/${id}/restore`);
    }

};

export default classSubjectApi;