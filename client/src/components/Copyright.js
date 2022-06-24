import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Copyright() {
  return (
    <footer>
      <hr />
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <MuiLink color="inherit" href="https://github.com/trash89/">
          by trash89
        </MuiLink>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </footer>
  );
}
