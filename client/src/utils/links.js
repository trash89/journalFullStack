import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 1, text: "journal", path: "/", icon: <IoBarChartSharp /> },
  { id: 2, text: "clients", path: "clients", icon: <MdQueryStats /> },
  { id: 3, text: "projects", path: "projects", icon: <FaWpforms /> },
  { id: 4, text: "subprojects", path: "subprojects", icon: <FaWpforms /> },
  { id: 5, text: "profile", path: "profile", icon: <ImProfile /> },
];

export default links;
