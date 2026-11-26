import api from "./api";

/*
|--------------------------------------------------------------------------
| Attendance Reports
|--------------------------------------------------------------------------
*/

export const getAttendanceReportFilters = async () => {
    return await api.get(
        "/attendance-management/reports"
    );
};

export const getDailyAttendanceReport = async (data) => {
    return await api.post(
        "/attendance-management/reports/daily",
        data
    );
};

export const getStudentAttendanceReport = async (data) => {
    return await api.post(
        "/attendance-management/reports/student",
        data
    );
};

export const getClassAttendanceReport = async (data) => {
    return await api.post(
        "/attendance-management/reports/class",
        data
    );
};

export const getMonthlyAttendanceReport = async (data) => {
    return await api.post(
        "/attendance-management/reports/monthly",
        data
    );
};

export const getAttendanceSummary = async (data) => {
    return await api.post(
        "/attendance-management/reports/summary",
        data
    );
};

export const exportAttendanceExcel = async (data) => {
    return await api.post(
        "/attendance-management/reports/export-excel",
        data,
        {
            responseType: "blob",
        }
    );
};

export const exportAttendancePdf = async (data) => {
    return await api.post(
        "/attendance-management/reports/export-pdf",
        data,
        {
            responseType: "blob",
        }
    );
};