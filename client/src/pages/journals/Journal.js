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

import { useIsMounted } from "../../hooks";

const JOURNALS_QUERY = gql`
  query journalsQuery {
    journals(skip: 0, take: 10, orderBy: { EntryDate: desc }) {
      count
      list {
        idProfile
        idClient
        idProject
        idSubproject
        idJournal
        createdAt
        updatedAt
        EntryDate
        Description
        Todos
        ThingsDone
        DocUploaded
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

  const { data } = useQuery(JOURNALS_QUERY);
  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="journals" size="small" padding="checkbox">
        <TableHead>
          <TableRow>
            <TableCell align="left">Action</TableCell>
            <TableCell align="right">Profile</TableCell>
            <TableCell align="right">Client</TableCell>
            <TableCell align="right">Project</TableCell>
            <TableCell align="right">Subproject</TableCell>
            <TableCell align="left">Entry Date</TableCell>
            <TableCell align="left">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.journals?.list.map((row) => {
            return (
              <TableRow key={row.idJournal} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover={true}>
                <TableCell align="left">
                  <Link to={`/journals/${row.idJournal}`}>edit</Link>
                </TableCell>
                <TableCell align="right">{row.profile.Username}</TableCell>
                <TableCell align="right">{row.client.Name}</TableCell>
                <TableCell align="right">{row.project.Name}</TableCell>
                <TableCell align="right">{row.subproject.Name}</TableCell>
                <TableCell align="left">{row.EntryDate}</TableCell>
                <TableCell align="left">{row.Description}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Journal;
