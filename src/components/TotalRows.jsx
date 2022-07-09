import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";

const TotalRows = ({ link, count, download = "" }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>
        {link !== "" && (
          <Link to={link}>
            <AddIcon />
          </Link>
        )}
      </span>
      {download !== "" && (
        <IconButton area-label="CSV download" onClick={download} size="small">
          <DownloadIcon />
        </IconButton>
      )}
      <span>{count} rows</span>
    </div>
  );
};

export default TotalRows;
