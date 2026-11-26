import api from "./api";

const roleApi = {
    getAll: () => api.get("/roles"),
};

export default roleApi;