import api from "./api";

export const getCourses = async () => {
    const response = await api.get("/react/courses");
    return response.data.courses;
};

export const getCourse = async (slug) => {
    const response = await api.get(`/react/courses/${slug}`);
    return response.data.course;
};