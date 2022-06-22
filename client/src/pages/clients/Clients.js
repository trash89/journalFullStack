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

const CLIENTS_QUERY = gql`
  query clientsQuery {
    clients(skip: 0, take: 10, orderBy: { Name: asc }) {
      count
      list {
        idProfile
        idClient
        Name
        Description
        StartDate
        EndDate
        profile {
          idProfile
          Username
        }
      }
    }
  }
`;

const Clients = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { data } = useQuery(CLIENTS_QUERY);
  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <>
      <Link to="newclient">Add Client</Link>
      <TableContainer component={Paper}>
        <Table aria-label="clients" size="small" padding="checkbox">
          <TableHead>
            <TableRow>
              <TableCell align="left">Action</TableCell>
              <TableCell align="right">Profile</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.clients?.list.map((row) => {
              return (
                <TableRow key={row.idClient} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover={true}>
                  <TableCell align="left">
                    <Link to={`/clients/${row.idClient}`}>edit</Link>
                  </TableCell>
                  <TableCell align="right">{row.profile.Username}</TableCell>
                  <TableCell align="left">{row.Name}</TableCell>
                  <TableCell align="left">{row.Description}</TableCell>
                  <TableCell align="right">{row.StartDate}</TableCell>
                  <TableCell align="right">{row.EndDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Clients;
