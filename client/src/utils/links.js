import { BsPersonLinesFill, BsJournals } from "react-icons/bs";
import { FaWpforms, FaProjectDiagram } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 1, text: "journal", path: "/", icon: <BsJournals /> },
  { id: 2, text: "clients", path: "clients", icon: <BsPersonLinesFill /> },
  { id: 3, text: "projects", path: "projects", icon: <FaProjectDiagram /> },
  { id: 4, text: "subprojects", path: "subprojects", icon: <FaWpforms /> },
  { id: 5, text: "profiles", path: "profiles", icon: <ImProfile /> },
];

export default links;
