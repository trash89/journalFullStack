import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Header from "../components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>With Iron Session</title>
      </Head>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}
