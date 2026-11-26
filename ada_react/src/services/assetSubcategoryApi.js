import api from "./api";

const BASE_URL = "/configuration/asset-subcategories";

const assetSubcategoryApi = {

    // Get active subcategories
    getAll() {
        return api.get(BASE_URL);
    },

    // Get inactive subcategories
    getInactive() {
        return api.get(`${BASE_URL}/inactive`);
    },

    // Get single subcategory
    getById(id) {
        return api.get(`${BASE_URL}/${id}`);
    },

    // Create subcategory
    create(data) {
        return api.post(BASE_URL, data);
    },

    // Update subcategory
    update(id, data) {
        return api.put(`${BASE_URL}/${id}`, data);
    },

    // Move to inactive
    delete(id) {
        return api.delete(`${BASE_URL}/${id}`);
    },

    // Restore
    restore(id) {
        return api.put(`${BASE_URL}/${id}/restore`);
    },

};

export default assetSubcategoryApi;