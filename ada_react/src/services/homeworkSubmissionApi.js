import api from "./api";

const BASE_URL = "/homework-submissions";

const homeworkSubmissionApi = {

    getAll: (params = {}) =>
        api.get(BASE_URL, {
            params,
        }),

    getById: (homeworkId) =>
        api.get(`${BASE_URL}/${homeworkId}`),

    // Student submits homework


    submit: (homeworkId, data) =>
        api.post(
            `${BASE_URL}/${homeworkId}/submit`,
            data
        ),

    // Teacher checks / unchecks student submission
    updateStudentStatus: (
        homeworkId,
        studentId,
        checked
    ) =>
        api.put(
            `${BASE_URL}/${homeworkId}/students/${studentId}/status`,
            {
                checked,
            }
        ),

};

export default homeworkSubmissionApi;