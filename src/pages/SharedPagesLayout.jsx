import React from "react";
import { Outlet } from "react-router-dom";

const SharedPagesLayout = ({ title = "" }) => {
  return (
    <>
      <h4>{title}</h4>
      <Outlet />
    </>
  );
};
export default SharedPagesLayout;
