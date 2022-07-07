import React from "react";
import { Outlet } from "react-router-dom";
import { Copyright } from "../components";

const SharedPagesLayout = ({ title = "" }) => {
  return (
    <>
      <h4>{title}</h4>
      <Outlet />
    </>
  );
};
export default SharedPagesLayout;
