import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  SharedLayout,
  SharedPagesLayout,
  Error,
  Register,
  ProtectedRoute,
  Journals,
  SingleJournal,
  Projects,
  SingleProject,
  Subprojects,
  SingleSubproject,
  Profiles,
  SingleProfile,
  Clients,
  SingleClient,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IndexJournals = () => {
  return (
    <SharedPagesLayout title="journals">
      <Journals />
    </SharedPagesLayout>
  );
};
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
          <Route index element={<IndexJournals />} />

          <Route path="journals" element={<SharedPagesLayout title="journals" />}>
            <Route index element={<Journals />} />
            <Route path=":idJournal" element={<SingleJournal />} />
          </Route>

          <Route path="projects" element={<SharedPagesLayout title="projects" />}>
            <Route index element={<Projects />} />
            <Route path=":idProject" element={<SingleProject />} />
          </Route>

          <Route path="subprojects" element={<SharedPagesLayout title="subprojects" />}>
            <Route index element={<Subprojects />} />
            <Route path=":idSubproject" element={<SingleSubproject />} />
          </Route>

          <Route path="clients" element={<SharedPagesLayout title="clients" />}>
            <Route index element={<Clients />} />
            <Route path=":idClient" element={<SingleClient />} />
          </Route>

          <Route path="profiles" element={<SharedPagesLayout title="profiles" />}>
            <Route index element={<Profiles />} />
            <Route path=":idProfile" element={<SingleProfile />} />
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
