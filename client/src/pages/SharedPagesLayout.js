import { Outlet } from "react-router-dom";

const SharedPagesLayout = ({ title = "" }) => {
  return (
    <>
      <h2>{title}</h2>
      <Outlet />
    </>
  );
};
export default SharedPagesLayout;
