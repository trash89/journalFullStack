import React from "react";

const Journal = ({ stars }) => {
  return (
    <>
      <div>Journal Page</div>
      <div>Next stars:{stars}</div>
    </>
  );
};

export async function getServerSideProps(context) {
  console.log("run getServerSideProps");
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const json = await res.json();
  return {
    props: { stars: json.stargazers_count },
  };
}

export default Journal;
