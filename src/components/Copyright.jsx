import React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Wrapper from "../assets/wrappers/Copyright";

export default function Copyright() {
  return (
    <Wrapper>
      <footer className="footer">
        <Typography color="text.secondary" align="center">
          {"Copyright © "}
          <MuiLink color="inherit" href="https://github.com/trash89/">
            by trash89
          </MuiLink>{" "}
          {new Date().getFullYear()}.
        </Typography>
      </footer>
    </Wrapper>
  );
}
