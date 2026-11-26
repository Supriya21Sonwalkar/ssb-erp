import api from "./api";

export const getRegistrationDropdowns = async () => {
    const response = await api.get("/react/student-registration/dropdowns");
    return response.data;
};

export const getSectionsByClass = async (classId) => {
    const response = await api.get(`/react/student-registration/sections-by-class/${classId}`);
    return response.data;
};

export const submitStudentRegistration = async (formData) => {
    const response = await api.post("/react/student-registration/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
