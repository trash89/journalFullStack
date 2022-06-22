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

const PROJECTS_QUERY = gql`
  query projectsQuery {
    projects(skip: 0, take: 10, orderBy: { Name: asc }) {
      count
      list {
        idClient
        idProject
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
      }
    }
  }
`;

const Projects = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { data } = useQuery(PROJECTS_QUERY);
  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <>
      <Link to="newproject">Add Project</Link>
      <TableContainer component={Paper}>
        <Table aria-label="projects" size="small" padding="checkbox">
          <TableHead>
            <TableRow>
              <TableCell align="left">Action</TableCell>
              <TableCell align="right">Client</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Default?</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="left">Finished?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.projects?.list.map((row) => {
              return (
                <TableRow key={row.idProject} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover={true}>
                  <TableCell align="left">
                    <Link to={`/projects/${row.idProject}`}>edit</Link>
                  </TableCell>
                  <TableCell align="right">{row.client.Name}</TableCell>
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
    </>
  );
};

export default Projects;
