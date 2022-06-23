import ProtectedRoute from "./ProtectedRoute";
import SharedLayout from "./SharedLayout";
import SharedPagesLayout from "./SharedPagesLayout";
import { Journal, EditJournal, NewJournal } from "./journals/";
import { Clients, EditClient, NewClient } from "./clients";
import { Projects, EditProject, NewProject } from "./projects";
import { Subprojects, EditSubproject, NewSubproject } from "./subprojects";
import { Profiles, EditProfile, NewProfile } from "./profiles";
import Register from "./Register";
import Error from "./Error";

export {
  Register,
  Error,
  ProtectedRoute,
  SharedLayout,
  SharedPagesLayout,
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
};
