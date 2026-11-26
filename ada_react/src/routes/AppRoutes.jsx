import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import StudentRoutes from "./StudentRoutes";
import AttendanceRoutes from "./AttendanceRoutes";
import HomeworkAssignmentRoutes from "./HomeworkAssignmentRoutes";
import FeesManagementRoutes from "./FeesManagementRoutes";
import ConfigurationRoutes from "./ConfigurationRoutes";
import CommunicationRoutes from "./CommunicationRoutes";
import UserManagementRoutes from "./UserManagementRoutes";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AcademicLayout from "../layouts/AcademicLayout";
import ConfigurationLayout from "../layouts/ConfigurationLayout";
import ModuleDashboardLayout from "../layouts/ModuleDashboardLayout";
import StudentManagementLayout from "../layouts/StudentManagementLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import Gallery from "../pages/Gallery";
import Resources from "../pages/Resources";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Booking from "../pages/Booking";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import StudentRegistration from "../pages/StudentRegistration";

import AcademicYearIndex from "../pages/AcademicManagement/AcademicYear/Index";
import AcademicYearCreate from "../pages/AcademicManagement/AcademicYear/Create";
import AcademicYearEdit from "../pages/AcademicManagement/AcademicYear/Edit";
import AcademicYearShow from "../pages/AcademicManagement/AcademicYear/Show";
import AcademicYearInactive from "../pages/AcademicManagement/AcademicYear/Inactive";
// Class Master
import ClassIndex from "../pages/AcademicManagement/Class/Index";
import ClassCreate from "../pages/AcademicManagement/Class/Create";
import ClassEdit from "../pages/AcademicManagement/Class/Edit";
import ClassShow from "../pages/AcademicManagement/Class/Show";
import ClassInactive from "../pages/AcademicManagement/Class/Inactive";
// Section Master
import SectionIndex from "../pages/AcademicManagement/Sections/Index";
import SectionCreate from "../pages/AcademicManagement/Sections/Create";
import SectionEdit from "../pages/AcademicManagement/Sections/Edit";
import SectionShow from "../pages/AcademicManagement/Sections/Show";
import SectionInactive from "../pages/AcademicManagement/Sections/Inactive";

import SubjectIndex from "../pages/AcademicManagement/Subjects/Index";
import SubjectCreate from "../pages/AcademicManagement/Subjects/Create";
import SubjectEdit from "../pages/AcademicManagement/Subjects/Edit";
import SubjectShow from "../pages/AcademicManagement/Subjects/Show";
import SubjectInactive from "../pages/AcademicManagement/Subjects/Inactive";

import ClassSubjectIndex from "../pages/AcademicManagement/ClassSubjects/Index";
import ClassSubjectCreate from "../pages/AcademicManagement/ClassSubjects/Create";
import ClassSubjectEdit from "../pages/AcademicManagement/ClassSubjects/Edit";

import StudentIndex from "../pages/StudentManagement/StudentRegistration/Index";
import StudentCreate from "../pages/StudentManagement/StudentRegistration/Create";
import StudentEdit from "../pages/StudentManagement/StudentRegistration/Edit";
import StudentShow from "../pages/StudentManagement/StudentRegistration/Show";
import StudentInactive from "../pages/StudentManagement/StudentRegistration/Inactive";
import ClassSubjectShow from "../pages/AcademicManagement/ClassSubjects/Show";
import ClassSubjectInactive from "../pages/AcademicManagement/ClassSubjects/Inactive";

import EmployeeIndex from "../pages/Employees/Index";   
import EmployeeCreate from "../pages/Employees/Create";
import Search from "../pages/Employees/Search";
import EmployeeEdit from "../pages/Employees/Edit";
import EmployeeShow from "../pages/Employees/Show";
import EmployeeInactive from "../pages/Employees/Inactive";

import BranchIndex from "../pages/Configuration/Branch/Index";
import BranchCreate from "../pages/Configuration/Branch/Create";
import BranchEdit from "../pages/Configuration/Branch/Edit";
import BranchShow from "../pages/Configuration/Branch/Show";
import BranchInactive from "../pages/Configuration/Branch/Inactive";

import ModuleIndex from "../pages/Modules/Index";
import ModuleCreate from "../pages/Modules/Create";
import ModuleEdit from "../pages/Modules/Edit";
import ModuleShow from "../pages/Modules/Show";
import ModuleInactive from "../pages/Modules/Inactive";
import ModuleDashboard from "../pages/Modules/Dashboard";

// Teacher Allocation
import TeacherAllocationIndex from "../pages/AcademicManagement/TeacherAllocation/Index";
import TeacherAllocationCreate from "../pages/AcademicManagement/TeacherAllocation/Create";
import TeacherAllocationEdit from "../pages/AcademicManagement/TeacherAllocation/Edit";
import TeacherAllocationShow from "../pages/AcademicManagement/TeacherAllocation/Show";
import TeacherAllocationInactive from "../pages/AcademicManagement/TeacherAllocation/Inactive";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/student-registration" element={<StudentRegistration />} />
                </Route>

                <Route path="/login" element={<Login />} />

            <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/configuration" element={<ConfigurationLayout />}>

                <Route path="dashboard" element={<Dashboard />} />

                <Route path="modules" element={<ModuleIndex />} />
                <Route path="modules/create" element={<ModuleCreate />} />
                <Route path="modules/edit/:id" element={<ModuleEdit />} />
                <Route path="modules/show/:id" element={<ModuleShow />} />
                <Route path="modules/inactive" element={<ModuleInactive />} />

                <Route path="employees" element={<EmployeeIndex />} />
                <Route path="employees/search" element={<Search />} />
                <Route path="employees/create" element={<EmployeeCreate />} />
                <Route path="employees/:id/edit" element={<EmployeeEdit />} />
                <Route path="employees/:id" element={<EmployeeShow />} />
                <Route path="employees/inactive" element={<EmployeeInactive />} />

                <Route path="branches" element={<BranchIndex />} />
                <Route path="branches/create" element={<BranchCreate />} />
                <Route path="branches/show/:id" element={<BranchShow />} />
                <Route path="branches/edit/:id" element={<BranchEdit />} />
                <Route path="branches/inactive" element={<BranchInactive />} />

            </Route>

            <Route path="/academic-management" element={<AcademicLayout />}>

                <Route path="academic-year" element={<AcademicYearIndex />} />
                <Route path="academic-year/create" element={<AcademicYearCreate />} /> 
                <Route path="academic-year/edit/:id" element={<AcademicYearEdit />} /> 
                <Route path="academic-year/show/:id" element={<AcademicYearShow />} /> 
                <Route path="academic-year/inactive" element={<AcademicYearInactive />} /> 
            
                <Route path="classes" element={<ClassIndex />} />
                <Route path="classes/create" element={<ClassCreate />} />
                <Route path="classes/show/:id" element={<ClassShow />} />
                <Route path="classes/edit/:id" element={<ClassEdit />} />
                <Route path="classes/inactive" element={<ClassInactive />} />

                <Route path="sections" element={<SectionIndex />} />
                <Route path="sections/create" element={<SectionCreate />} />
                <Route path="sections/show/:id" element={<SectionShow />} />
                <Route path="sections/edit/:id" element={<SectionEdit />} />
                <Route path="sections/inactive" element={<SectionInactive />} />

                <Route path="subjects" element={<SubjectIndex />} />
                <Route path="subjects/create" element={<SubjectCreate />} />
                <Route path="subjects/edit/:id" element={<SubjectEdit />} />
                <Route path="subjects/show/:id" element={<SubjectShow />} />
                <Route path="subjects/inactive" element={<SubjectInactive />} />

                <Route path="class-subjects" element={<ClassSubjectIndex />} />
                <Route path="class-subjects/create" element={<ClassSubjectCreate />} />
                <Route path="class-subjects/show/:id" element={<ClassSubjectShow />} />
                <Route path="class-subjects/edit/:id" element={<ClassSubjectEdit />} />
                <Route path="class-subjects/inactive" element={<ClassSubjectInactive />} />

                <Route path="teacher-allocations" element={<TeacherAllocationIndex />} />
                <Route path="teacher-allocations/create" element={<TeacherAllocationCreate />} />
                <Route path="teacher-allocations/edit/:id" element={<TeacherAllocationEdit />} />
                <Route path="teacher-allocations/show/:id" element={<TeacherAllocationShow />} /> 
                <Route path="teacher-allocations/inactive" element={<TeacherAllocationInactive />} /> 
            </Route>

            <Route path="/modules/dashboard" element={<ModuleDashboardLayout />}>
                <Route index element={<ModuleDashboard />} />
            </Route>

            <Route path="/modules/show/:id" element={<ModuleShow />} />

            {StudentRoutes}
            {AttendanceRoutes}
            {ConfigurationRoutes}
            {UserManagementRoutes}

            <Route path="/homework-assignment/*" element={<HomeworkAssignmentRoutes />} /> 
            <Route path="/fees/*" element={<FeesManagementRoutes />} /> 
            <Route path="/communication/*" element={<CommunicationRoutes />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}