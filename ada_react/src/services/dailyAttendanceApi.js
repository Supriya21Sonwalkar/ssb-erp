import api from "./api";

/*
|--------------------------------------------------------------------------
| Daily Attendance
|--------------------------------------------------------------------------
*/

export const getAttendanceIndex = async (params = {}) => {
    return await api.get("/attendance-management/daily-attendance", {
        params,
    });
};

export const loadStudents = async (data) => {
    return await api.post(
        "/attendance-management/daily-attendance/load-students",
        data
    );
};

export const storeAttendance = async (data) => {
    return await api.post(
        "/attendance-management/daily-attendance/store",
        data
    );
};

export const showAttendance = async (id) => {
    return await api.get(
        `/attendance-management/daily-attendance/show/${id}`
    );
};

export const updateAttendance = async (id, data) => {
    return await api.put(
        `/attendance-management/daily-attendance/update/${id}`,
        data
    );
};

export const lockAttendance = async (id) => {
    return await api.put(
        `/attendance-management/daily-attendance/lock/${id}`
    );
};

export const unlockAttendance = async (id) => {
    return await api.put(
        `/attendance-management/daily-attendance/unlock/${id}`
    );
};

export const getInactiveAttendance = async () => {
    return await api.get(
        "/attendance-management/daily-attendance/inactive"
    );
};

export const restoreAttendance = async (id) => {
    return await api.put(
        `/attendance-management/daily-attendance/restore/${id}`
    );
};

export const deactivateAttendance = async (id) => {
    return await api.delete(
        `/attendance-management/daily-attendance/delete/${id}`
    );
};