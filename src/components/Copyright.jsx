import React from "react";
import Wrapper from "../assets/wrappers/Copyright";

export default function Copyright() {
  return (
    <Wrapper>
      <footer className="footer">
        {"© "} {new Date().getFullYear()}
        {" by "}
        <a href="https://github.com/trash89/">trash89</a>
        {". All rights reserved. Built with "}{" "}
        <a href="https://reactjs.org/">React</a>
      </footer>
    </Wrapper>
  );
}

//© 2022 John Smilga. All rights reserved. Built withGatsby
