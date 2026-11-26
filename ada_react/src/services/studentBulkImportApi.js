import api from "./api";

const BASE_URL = "/student-management/bulk-import";

const studentBulkImportApi = {
    downloadSample() {
        return api.get(`${BASE_URL}/download-sample`, {
            responseType: "blob",
        });
    },

    upload(formData) {
        return api.post(`${BASE_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    preview(formData) {
        return api.post(`${BASE_URL}/preview`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    validate(data) {
        return api.post(`${BASE_URL}/validate`, {
            data: data,
        });
    },

    save(data) {
        return api.post(`${BASE_URL}/import`, {
            data: data,
        });
    },
};

export default studentBulkImportApi;