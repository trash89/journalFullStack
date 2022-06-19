import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}
