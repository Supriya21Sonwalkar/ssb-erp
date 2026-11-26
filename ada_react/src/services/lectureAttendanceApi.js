import api from "./api";

const BASE_URL = "/attendance-management/lecture-attendance";

/*
|--------------------------------------------------------------------------
| Get Lecture Attendance Index
|--------------------------------------------------------------------------
*/

export const getLectureAttendanceIndex = (params = {}) => {
    return api.get(`${BASE_URL}/index`, {
        params,
    });
};


/*
|--------------------------------------------------------------------------
| Load Lecture Students
|--------------------------------------------------------------------------
*/

export const loadLectureStudents = (data) => {
    return api.post(
        `${BASE_URL}/load-students`,
        data
    );
};


/*
|--------------------------------------------------------------------------
| Store Lecture Attendance
|--------------------------------------------------------------------------
*/

export const storeLectureAttendance = (data) => {
    return api.post(
        `${BASE_URL}/store`,
        data
    );
};


/*
|--------------------------------------------------------------------------
| Default API Object
|--------------------------------------------------------------------------
*/

const lectureAttendanceApi = {

    getAll: getLectureAttendanceIndex,

    loadStudents: loadLectureStudents,

    store: storeLectureAttendance,

};

export default lectureAttendanceApi;