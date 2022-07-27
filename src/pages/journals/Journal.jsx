import { Link, Navigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";

import moment from "moment";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { TotalRows } from "../../components";

const JOURNALS_QUERY = gql`
  query journalsQuery {
    journals(orderBy: { EntryDate: desc }) {
      count
      list {
        idProfile
        idClient
        idProject
        idSubproject
        idJournal
        EntryDate
        Description
        Todos
        profile {
          idProfile
          Username
        }
        client {
          idClient
          Name
        }
        project {
          idProject
          Name
        }
        subproject {
          idSubproject
          Name
        }
      }
    }
  }
`;

const Journal = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { data, loading } = useQuery(JOURNALS_QUERY);

  const escapeCsvCell = (cell) => {
    if (cell == null) {
      return "";
    }
    const sc = cell.toString().trim();
    if (sc === "" || sc === '""') {
      return sc;
    }
    if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
      return '"' + sc.replace(/"/g, '""') + '"';
    }
    return sc;
  };

  const makeCsvData = (columns, data) => {
    return data.reduce((csvString, rowItem) => {
      return csvString + columns.map(({ accessor }) => escapeCsvCell(accessor(rowItem))).join(",") + "\r\n";
    }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
  };

  const downloadAsCsv = (columns, data, filename) => {
    const csvData = makeCsvData(columns, data);
    const csvFile = new Blob([csvData], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.display = "none";
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.EntryDate, name: "EntryDate" },
      { accessor: (item) => item.Description, name: "Description" },
      { accessor: (item) => item.Todos, name: "Todos" },
      { accessor: (item) => item.client.Name, name: "Client" },
      { accessor: (item) => item.project.Name, name: "Project" },
      { accessor: (item) => item.subproject.Name, name: "Subproject" },
    ];

    downloadAsCsv(columns, data.journals.list, "Journal");
  };

  if (!isMounted) return <></>;
  if (loading) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!data || data === undefined) return <></>;
  return (
    <div>
      <TotalRows link="/journals/newjournal" count={data.journals.count} download={handleDownloadCsv} />
      <TableContainer component={Paper} sx={{ maxHeight: 440, maxWidth: 1100 }}>
        <Table aria-label="projects" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Entry Date
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Profile
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Client
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Project
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Subproject
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.journals?.list?.map((item) => {
              const localItem = {
                id: parseInt(item.idJournal),
                EntryDate: new moment(item.EntryDate).format(dateFormat),
                description: item.Description.substring(0, 50),
                profile: item.profile.Username.substring(0, 10),
                client: item.client.Name.substring(0, 15),
                project: item.project.Name.substring(0, 15),
                subproject: item.subproject.Name.substring(0, 15),
              };
              return (
                <TableRow key={localItem.id}>
                  <TableCell>
                    <Link to={`/journals/${localItem.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>{localItem.EntryDate}</TableCell>
                  <TableCell>{localItem.description}</TableCell>
                  <TableCell>{localItem.profile}</TableCell>
                  <TableCell>{localItem.client}</TableCell>
                  <TableCell>{localItem.project}</TableCell>
                  <TableCell>{localItem.subproject}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Journal;
