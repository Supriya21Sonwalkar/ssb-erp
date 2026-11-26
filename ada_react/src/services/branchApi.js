import api from "./api";
const BASE_URL = "/configuration/branches";

const branchApi = {

    getAll() {return api.get(BASE_URL);},
    getInactive() {return api.get(`${BASE_URL}/inactive`);},
    getById(id) {return api.get(`${BASE_URL}/${id}`);},

    create(data) {return api.post(BASE_URL, data);},
    update(id, data) {return api.put(`${BASE_URL}/${id}`, data);},
    delete(id) {return api.delete(`${BASE_URL}/${id}`);},
    restore(id) {return api.put(`${BASE_URL}/${id}/restore`);},
};

export default branchApi;