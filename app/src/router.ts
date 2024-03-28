import { createBrowserRouter } from "react-router-dom";
import StudentsPage, { loader as studentsLoader } from "./StudentsPage";

const router = createBrowserRouter([
    {
        index: true,
        Component: StudentsPage,
        loader: studentsLoader
    }
]);

export default router;