import { Route } from "react-router-dom";
import StudentManagementLayout from "../layouts/StudentManagementLayout";
import StudentIndex from "../pages/StudentManagement/StudentRegistration/Index";
import StudentCreate from "../pages/StudentManagement/StudentRegistration/Create";
import StudentEdit from "../pages/StudentManagement/StudentRegistration/Edit";
import StudentShow from "../pages/StudentManagement/StudentRegistration/Show";
import StudentInactive from "../pages/StudentManagement/StudentRegistration/Inactive";
import StudentBulkImport from "../pages/StudentManagement/StudentBulkImport/Index";
import StudentBulkImportPreview from "../pages/StudentManagement/StudentBulkImport/Preview";

const StudentRoutes = (

    <Route path="/student-management" element={<StudentManagementLayout />} > 
        <Route path="students" element={<StudentIndex />} />
        <Route path="students/create" element={<StudentCreate />} />
        <Route path="students/edit/:id" element={<StudentEdit />} />
        <Route path="students/show/:id" element={<StudentShow />} />
        <Route path="students/inactive" element={<StudentInactive />} />
        <Route path="students/bulk-import" element={<StudentBulkImport />} /> 
        <Route path="students/bulk-import/preview" element={<StudentBulkImportPreview />} /> 
    </Route>
);

export default StudentRoutes;