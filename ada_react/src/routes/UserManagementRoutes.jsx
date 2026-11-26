import { Route } from "react-router-dom";

// Layout
import UserManagementLayout from "../layouts/UserManagementLayout";

// Pages
import UserManagementDashboard from "../pages/UserManagement/Dashboard";
import RolesPermissionsIndex from "../pages/UserManagement/RolesPermissions/Index";

import UserIndex from "../pages/UserManagement/Users/Index";
import UserCreate from "../pages/UserManagement/Users/Create";
import UserEdit from "../pages/UserManagement/Users/Edit";
import UserView from "../pages/UserManagement/Users/View";


import UserRolesIndex from "../pages/UserManagement/Roles/Index";
import CreateRole from "../pages/UserManagement/Roles/Create";
import EditRole from "../pages/UserManagement/Roles/Edit";
import ViewRole from "../pages/UserManagement/Roles/View";

const UserManagementRoutes = (
  <Route path="/user-management" element={<UserManagementLayout />}>
    {/* User Management Dashboard */}
    <Route path="dashboard" element={<UserManagementDashboard />} />

    {/* Users */}
    <Route path="users" element={<UserIndex />} />
    <Route path="users/create" element={<UserCreate />} />
    <Route path="users/:id/edit" element={<UserEdit />} />
    <Route path="users/:id" element={<UserView />} />

    {/* Roles & Permissions */}
    <Route path="roles-permissions" element={<RolesPermissionsIndex />} /> 


    <Route path="roles" element={<UserRolesIndex />} /> 
    <Route path="roles/create" element={<CreateRole />} />
    <Route path="roles/:id/edit" element={<EditRole />} />
    <Route path="roles/:id" element={<ViewRole />} />


  </Route>
);

export default UserManagementRoutes;