import React from "react";
import { Routes, Route } from "react-router-dom";

import CommunicationLayout from "../layouts/CommunicationLayout";

import NoticeIndex from "../pages/Communication/Notices/Index";
import NoticeCreate from "../pages/Communication/Notices/Create";
import NoticeEdit from "../pages/Communication/Notices/Edit";
import NoticeView from "../pages/Communication/Notices/View";
import NoticeInactive from "../pages/Communication/Notices/Inactive";

const CommunicationRoutes = () => {
  return (
    <Routes>
      <Route element={<CommunicationLayout />}>
        <Route path="notices" element={<NoticeIndex />} />
        <Route path="notices/create" element={<NoticeCreate />} />
        <Route path="notices/:id" element={<NoticeView />} />
        <Route path="notices/:id/edit" element={<NoticeEdit />} />
        <Route path="notices/inactive" element={<NoticeInactive />} />
      </Route>
    </Routes>
  );
};

export default CommunicationRoutes;