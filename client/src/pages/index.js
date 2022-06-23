import ProtectedRoute from "./ProtectedRoute";
import SharedLayout from "./SharedLayout";
import SharedPagesLayout from "./SharedPagesLayout";
import { Journal, SingleJournal, NewJournal } from "./journals/";
import { Clients, SingleClient, NewClient } from "./clients";
import { Projects, SingleProject, NewProject } from "./projects";
import { Subprojects, SingleSubproject, NewSubproject } from "./subprojects";
import { Profiles, SingleProfile, NewProfile } from "./profiles";
import Register from "./Register";
import Error from "./Error";

export {
  Register,
  Error,
  ProtectedRoute,
  SharedLayout,
  SharedPagesLayout,
  Journal,
  SingleJournal,
  NewJournal,
  Projects,
  SingleProject,
  NewProject,
  Subprojects,
  SingleSubproject,
  NewSubproject,
  Profiles,
  SingleProfile,
  NewProfile,
  Clients,
  SingleClient,
  NewClient,
};
