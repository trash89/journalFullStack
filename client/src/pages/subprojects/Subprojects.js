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

const SUBPROJECTS_QUERY = gql`
  query subprojectsQuery {
    subprojects {
      count
      list {
        idProject
        idClient
        idSubproject
        Name
        Description
        isDefault
        StartDate
        EndDate
        Finished
        client {
          idClient
          Name
        }
        project {
          idProject
          Name
        }
      }
    }
  }
`;

const Subprojects = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { data } = useQuery(SUBPROJECTS_QUERY);
  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="subprojects" size="small" padding="checkbox">
        <TableHead>
          <TableRow>
            <TableCell align="left">Action</TableCell>
            <TableCell align="right">Client</TableCell>
            <TableCell align="right">Project</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left">Default?</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="left">Finished?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.subprojects?.list.map((row) => {
            return (
              <TableRow key={row.idSubproject} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover={true}>
                <TableCell align="left">
                  <Link to={`/subprojects/${row.idSubproject}`}>edit</Link>
                </TableCell>
                <TableCell align="right">{row.client.Name}</TableCell>
                <TableCell align="right">{row.project.Name}</TableCell>
                <TableCell align="left">{row.Name}</TableCell>
                <TableCell align="left">{row.Description}</TableCell>
                <TableCell align="left">{row.isDefault}</TableCell>
                <TableCell align="right">{row.StartDate}</TableCell>
                <TableCell align="right">{row.EndDate}</TableCell>
                <TableCell align="right">{row.Finished}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Subprojects;
