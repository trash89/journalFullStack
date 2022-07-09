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

import { useIsMounted } from "../../hooks";
import { TotalRows } from "../../components";

const PROFILES_QUERY = gql`
  query profilesQuery {
    profiles(orderBy: { Username: asc }) {
      count
      list {
        idProfile
        Username
        Is_Admin
        Keep
      }
    }
  }
`;

const Profiles = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);

  const { loading, data } = useQuery(PROFILES_QUERY);
  if (!isMounted) return <></>;
  if (loading) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!data?.profiles || data?.profiles === undefined) return <></>;
  return (
    <div>
      <TotalRows link="" count={data?.profiles?.count} />

      <TableContainer component={Paper}>
        <Table aria-label="profiles" size="small">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Username
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Admin?
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Keep?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.profiles?.list?.map((item) => {
              const localItem = {
                id: parseInt(item.idProfile),
                Username: item.Username,
                Is_Admin: item.Is_Admin,
                Keep: item.Keep,
              };
              return (
                <TableRow key={localItem.id}>
                  <TableCell>
                    <Link to={`/profiles/${localItem.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>{localItem.Username}</TableCell>
                  <TableCell>{localItem.Is_Admin}</TableCell>
                  <TableCell>{localItem.Keep}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Profiles;
