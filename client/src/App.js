import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Journal, Clients, Projects, Subprojects, Profile, SharedLayout, Error, Register, ProtectedRoute, SharedProfileLayout, SingleProfile } from "./pages";
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
          <Route path="journal" element={<Journal />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          <Route path="subprojects" element={<Subprojects />} />

          <Route path="profiles" element={<SharedProfileLayout />}>
            <Route index element={<Profile />} />
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
