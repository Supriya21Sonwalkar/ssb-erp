import api from "./api";

const BASE_URL = "/communication/notices";

const noticeApi = {
  // Get active notices
  getAll: (params = {}) =>
    api.get(BASE_URL, {
      params,
    }),

  // Get inactive notices
  getInactive: (params = {}) =>
    api.get(`${BASE_URL}/inactive`, {
      params,
    }),

  // Get single notice
  getById: (id) =>
    api.get(`${BASE_URL}/${id}`),

  // Create notice
  create: (data) =>
    api.post(BASE_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update notice
  update: (id, data) =>
    api.post(`${BASE_URL}/${id}?_method=PUT`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Deactivate notice
  delete: (id) =>
    api.delete(`${BASE_URL}/${id}`),

  // Restore notice
  restore: (id) =>
    api.patch(`${BASE_URL}/${id}/restore`),
};

export default noticeApi;