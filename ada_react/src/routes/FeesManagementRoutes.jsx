import { Routes, Route } from "react-router-dom";

import FeesManagementLayout from "../layouts/FeesManagementLayout";

import CoursesIndex from "../pages/FeesManagement/Courses/Index";
import CoursesCreate from "../pages/FeesManagement/Courses/Create";
import CoursesEdit from "../pages/FeesManagement/Courses/Edit";
import CoursesView from "../pages/FeesManagement/Courses/View";
import CoursesInactive from "../pages/FeesManagement/Courses/Inactive";

import ComponentsIndex from "../pages/FeesManagement/Components/Index";
import ComponentsCreate from "../pages/FeesManagement/Components/Create";  
import ComponentsEdit from "../pages/FeesManagement/Components/Edit"; 
import ComponentsView from "../pages/FeesManagement/Components/View";
import ComponentsInactive from "../pages/FeesManagement/Components/Inactive";

import InstallmentsIndex from "../pages/FeesManagement/Installments/Index";
import InstallmentsCreate from "../pages/FeesManagement/Installments/Create";
import InstallmentsEdit from "../pages/FeesManagement/Installments/Edit";
import InstallmentsView from "../pages/FeesManagement/Installments/View";
import InstallmentsInactive from "../pages/FeesManagement/Installments/Inactive";

import StructuresIndex from "../pages/FeesManagement/Structures/Index";
import StructuresCreate from "../pages/FeesManagement/Structures/Create";
import StructuresEdit from "../pages/FeesManagement/Structures/Edit";
import StructuresView from "../pages/FeesManagement/Structures/View";
import StructuresInactive from "../pages/FeesManagement/Structures/Inactive";

import FeesCollectionIndex from "../pages/FeesManagement/FeesCollection/Index";
import FeesCollectionCreate from "../pages/FeesManagement/FeesCollection/Create";

import FeeWaiversIndex from "../pages/FeesManagement/FeeWaivers/Index";
import FeeWaiversCreate from "../pages/FeesManagement/FeeWaivers/Create";

export default function FeesManagementRoutes() {

    return (
        <Routes>

            {/* Fees Management Layout */}
            <Route element={<FeesManagementLayout />}>
                <Route path="courses" element={<CoursesIndex />} /> 
                <Route path="courses/create" element={<CoursesCreate />} /> 
                <Route path="courses/:id/edit" element={<CoursesEdit />} /> 
                <Route path="courses/:id" element={<CoursesView />} />
                <Route path="courses/inactive" element={<CoursesInactive />} /> 


                <Route path="components" element={<ComponentsIndex />} />
                <Route path="components/create" element={<ComponentsCreate />} />
                <Route path="components/:id/edit" element={<ComponentsEdit />} />
                <Route path="components/:id" element={<ComponentsView />} /> 
                <Route path="components/inactive" element={<ComponentsInactive />} /> 

                <Route path="installments" element={<InstallmentsIndex />} />
                <Route path="installments/create" element={<InstallmentsCreate />} />
                <Route path="installments/:id/edit" element={<InstallmentsEdit />} />
                <Route path="installments/:id" element={<InstallmentsView />} />
                <Route path="installments/inactive" element={<InstallmentsInactive />} />

                <Route path="structure" element={<StructuresIndex />} /> 
                <Route path="structure/create" element={<StructuresCreate />} /> 
                <Route path="structure/:id/edit" element={<StructuresEdit />} /> 
                <Route path="structure/inactive" element={<StructuresInactive />} /> 

                <Route path="collection" element={<FeesCollectionIndex />} /> 
                <Route path="collection/create" element={<FeesCollectionCreate />} />

                <Route path="waivers" element={<FeeWaiversIndex />} />
                <Route path="waivers/create" element={<FeeWaiversCreate />} />

                
            </Route>
                

        </Routes>
    );
}