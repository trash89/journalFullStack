import React from "react";
import { BsPersonLinesFill, BsJournals } from "react-icons/bs";
import { FaWpforms, FaProjectDiagram } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 0, text: "journal", path: "journals", icon: <BsJournals /> },
  { id: 1, text: "clients", path: "clients", icon: <BsPersonLinesFill /> },
  { id: 2, text: "projects", path: "projects", icon: <FaProjectDiagram /> },
  { id: 3, text: "subprojects", path: "subprojects", icon: <FaWpforms /> },
  { id: 4, text: "profiles", path: "profiles", icon: <ImProfile /> },
];

const userLinks = [
  { id: 0, text: "Profiles", path: "/profiles" },
  { id: 1, text: "Logout", path: "/logout" },
];

export { links, userLinks };
