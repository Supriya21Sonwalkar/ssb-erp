import api from "./api";

const BASE_URL = "/fees/installments";

const installmentApi = {

    getAll: (params = {}) =>
        api.get(BASE_URL, {
            params,
        }),

    getById: (id) =>
        api.get(`${BASE_URL}/${id}`),

    create: (data) =>
        api.post(BASE_URL, data),

    update: (id, data) =>
        api.put(
            `${BASE_URL}/${id}`,
            data
        ),

    delete: (id) =>
        api.delete(
            `${BASE_URL}/${id}`
        ),

    toggleStatus: (id) =>
        api.put(
            `${BASE_URL}/${id}/toggle-status`
        ),

};

export default installmentApi;
