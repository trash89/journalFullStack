import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  SharedLayout,
  SharedPagesLayout,
  Error,
  Register,
  ProtectedRoute,
  Journal,
  EditJournal,
  NewJournal,
  Projects,
  EditProject,
  NewProject,
  Subprojects,
  EditSubproject,
  NewSubproject,
  Profiles,
  EditProfile,
  NewProfile,
  Clients,
  EditClient,
  NewClient,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Journal />} />

          <Route path="journals" element={<SharedPagesLayout title="journal" />}>
            <Route index element={<Journal />} />
            <Route path=":idJournal" element={<EditJournal />} />
            <Route path="newjournal" element={<NewJournal />} />
          </Route>

          <Route path="projects" element={<SharedPagesLayout title="projects" />}>
            <Route index element={<Projects />} />
            <Route path=":idProject" element={<EditProject />} />
            <Route path="newproject" element={<NewProject />} />
          </Route>

          <Route path="subprojects" element={<SharedPagesLayout title="subprojects" />}>
            <Route index element={<Subprojects />} />
            <Route path=":idSubproject" element={<EditSubproject />} />
            <Route path="newsubproject" element={<NewSubproject />} />
          </Route>

          <Route path="clients" element={<SharedPagesLayout title="clients" />}>
            <Route index element={<Clients />} />
            <Route path=":idClient" element={<EditClient />} />
            <Route path="newclient" element={<NewClient />} />
          </Route>

          <Route path="profiles" element={<SharedPagesLayout title="profiles" />}>
            <Route index element={<Profiles />} />
            <Route path=":idProfile" element={<EditProfile />} />
            <Route path="newprofile" element={<NewProfile />} />
          </Route>
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}

export default App;
