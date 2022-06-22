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

const PROFILES_QUERY = gql`
  query profilesQuery {
    profiles {
      count
      list {
        idProfile
        Username
        Is_Admin
      }
    }
  }
`;

const Profile = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { data } = useQuery(PROFILES_QUERY);

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="profiles" size="small" padding="normal">
        <TableHead>
          <TableRow>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Username</TableCell>
            <TableCell align="right">Admin?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.profiles?.list.map((row) => {
            return (
              <TableRow key={row.idProfile} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover={true}>
                <TableCell align="left">
                  <Link to={`/profiles/${row.idProfile}`}>edit</Link>
                </TableCell>
                <TableCell align="left">{row.Username}</TableCell>
                <TableCell align="right">{row.Is_Admin}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Profile;
