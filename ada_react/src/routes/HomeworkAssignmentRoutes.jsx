import { Routes, Route } from "react-router-dom";

import HomeworkAssignmentLayout from "../layouts/HomeworkAssignmentLayout"; 
import Index from "../pages/HomeworkAssignment/Posting/Index"; 
import Create from "../pages/HomeworkAssignment/Posting/Create"; 
import Show from "../pages/HomeworkAssignment/Posting/Show"; 
import Edit from "../pages/HomeworkAssignment/Posting/Edit"; 
import Inactive from "../pages/HomeworkAssignment/Posting/Inactive"; 
import SubmissionIndex from "../pages/HomeworkAssignment/Submission/Index"; 
import Track from "../pages/HomeworkAssignment/Submission/Track"; 
import Update from "../pages/HomeworkAssignment/Submission/Update";

export default function HomeworkAssignmentRoutes() {

    return (
        <Routes>
            <Route element={<HomeworkAssignmentLayout />} > 
                <Route path="/" element={<Index />} /> 
                <Route path="/create" element={<Create />} /> 
                <Route path="/:id" element={<Show />} /> 
                <Route path="/:id/edit" element={<Edit />} /> 
                <Route path="/inactive" element={<Inactive />} /> 
                <Route path="/submissions" element={<SubmissionIndex />} /> 
                <Route path="/submissions/:homeworkId/track" element={<Track />} /> 
                <Route path="/submissions/:homeworkId/update" element={<Update />} /> 
            </Route>
        </Routes>
    );
}