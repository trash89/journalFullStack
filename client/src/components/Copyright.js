import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <MuiLink color="inherit" href="https://github.com/trash89/">
        by Trash89
      </MuiLink>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
