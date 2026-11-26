import { Route } from "react-router-dom";

import AttendanceManagementLayout from "../layouts/AttendanceManagementLayout";

/*
|--------------------------------------------------------------------------
| Daily Attendance
|--------------------------------------------------------------------------
*/

import DailyAttendanceIndex from "../pages/AttendanceManagement/DailyAttendance/Index";
import DailyAttendanceCreate from "../pages/AttendanceManagement/DailyAttendance/Create";
import DailyAttendanceEdit from "../pages/AttendanceManagement/DailyAttendance/Edit";
import DailyAttendanceShow from "../pages/AttendanceManagement/DailyAttendance/Show";
import DailyAttendanceInactive from "../pages/AttendanceManagement/DailyAttendance/Inactive";

/*
|--------------------------------------------------------------------------
| Attendance Reports
|--------------------------------------------------------------------------
*/

import AttendanceReportIndex from "../pages/AttendanceManagement/AttendanceReport/Index";
import DailyReport from "../pages/AttendanceManagement/AttendanceReport/DailyReport";
import StudentReport from "../pages/AttendanceManagement/AttendanceReport/StudentReport";
import ClassReport from "../pages/AttendanceManagement/AttendanceReport/ClassReport";
import MonthlyReport from "../pages/AttendanceManagement/AttendanceReport/MonthlyReport";

import LectureAttendanceCreate from "../pages/AttendanceManagement/LectureAttendance/Create";
import LectureAttendanceIndex from "../pages/AttendanceManagement/LectureAttendance/Index";

const AttendanceRoutes = (

    <Route path="/attendance-management" element={<AttendanceManagementLayout />} > 
        {/* Daily Attendance */}
        <Route path="daily-attendance" element={<DailyAttendanceIndex />} /> 
        <Route path="daily-attendance/create" element={<DailyAttendanceCreate />} /> 
        <Route path="daily-attendance/edit/:id" element={<DailyAttendanceEdit />} /> 
        <Route path="daily-attendance/show/:id" element={<DailyAttendanceShow />} /> 
        <Route path="daily-attendance/inactive" element={<DailyAttendanceInactive />} /> 
        {/* Attendance Reports */}
        <Route path="reports" element={<AttendanceReportIndex />} /> 
        <Route path="reports/daily" element={<DailyReport />} /> 
        <Route path="reports/student" element={<StudentReport />} /> 
        <Route path="reports/class" element={<ClassReport />} /> 
        <Route path="reports/monthly" element={<MonthlyReport />} /> 
        <Route path="/attendance-management/lecture-attendance" element={<LectureAttendanceCreate />} /> 
        <Route path="/attendance-management/lecture-attendance/index" element={<LectureAttendanceIndex />} /> 
    </Route>

);

export default AttendanceRoutes;