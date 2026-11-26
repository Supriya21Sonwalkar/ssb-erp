import { Route } from "react-router-dom";

import ConfigurationLayout from "../layouts/ConfigurationLayout";

/*
|--------------------------------------------------------------------------
| Asset Categories
|--------------------------------------------------------------------------
*/

import AssetCategoryIndex from "../pages/Configuration/AssetCategory/Index";
import AssetCategoryCreate from "../pages/Configuration/AssetCategory/Create";
import AssetCategoryShow from "../pages/Configuration/AssetCategory/Show";
import AssetCategoryEdit from "../pages/Configuration/AssetCategory/Edit";
import AssetCategoryInactive from "../pages/Configuration/AssetCategory/Inactive";

/*
|--------------------------------------------------------------------------
| Asset Subcategories
|--------------------------------------------------------------------------
*/

import AssetSubcategoryIndex from "../pages/Configuration/AssetSubcategory/Index";
import AssetSubcategoryCreate from "../pages/Configuration/AssetSubcategory/Create";
import AssetSubcategoryShow from "../pages/Configuration/AssetSubcategory/Show";
import AssetSubcategoryEdit from "../pages/Configuration/AssetSubcategory/Edit";
import AssetSubcategoryInactive from "../pages/Configuration/AssetSubcategory/Inactive";


// Assets
import AssetIndex from "../pages/Configuration/Asset/Index";
import AssetCreate from "../pages/Configuration/Asset/Create";
import AssetShow from "../pages/Configuration/Asset/Show";
import AssetEdit from "../pages/Configuration/Asset/Edit";
import AssetInactive from "../pages/Configuration/Asset/Inactive";


const ConfigurationRoutes = (

    <Route path="/configuration" element={<ConfigurationLayout />} > 

        <Route path="asset-categories" element={<AssetCategoryIndex />} /> 
        <Route path="asset-categories/create" element={<AssetCategoryCreate />} /> 
        <Route path="asset-categories/show/:id" element={<AssetCategoryShow />} /> 
        <Route path="asset-categories/edit/:id" element={<AssetCategoryEdit />} /> 
        <Route path="asset-categories/inactive" element={<AssetCategoryInactive />} /> 

        <Route path="asset-subcategories" element={<AssetSubcategoryIndex />} /> 
        <Route path="asset-subcategories/create" element={<AssetSubcategoryCreate />} /> 
        <Route path="asset-subcategories/show/:id" element={<AssetSubcategoryShow />} /> 
        <Route path="asset-subcategories/edit/:id" element={<AssetSubcategoryEdit />} /> 
        <Route path="asset-subcategories/inactive" element={<AssetSubcategoryInactive />} /> 
       
        <Route path="assets" element={<AssetIndex />} /> 
        <Route path="assets/create" element={<AssetCreate />} /> 
        <Route path="assets/show/:id" element={<AssetShow />} /> 
        <Route path="assets/edit/:id" element={<AssetEdit />} /> 
        <Route path="assets/inactive" element={<AssetInactive />} /> 
    </Route>

);

export default ConfigurationRoutes;