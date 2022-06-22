import { Outlet } from "react-router-dom";

const SharedProfileLayout = () => {
  return (
    <>
      <h2>profiles</h2>
      <Outlet />
    </>
  );
};
export default SharedProfileLayout;
