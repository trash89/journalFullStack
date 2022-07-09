import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { gql, useQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { TotalRows } from "../../components";

import { clearValues } from "../../features/client/clientSlice";

const CLIENTS_QUERY = gql`
  query clientsQuery {
    clients(orderBy: { Name: asc }) {
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
  const dispatch = useDispatch();

  const { data, loading } = useQuery(CLIENTS_QUERY);

  useEffect(() => {
    dispatch(clearValues());
    // eslint-disable-next-line
  }, []);

  if (!isMounted) return <></>;
  if (loading) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!data || data === undefined) return <></>;
  return (
    <div>
      <TotalRows link="/clients/newclient" count={data.clients.count} />
      <TableContainer component={Paper}>
        <Table aria-label="clients" size="small">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Profile
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Client
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Start Date
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                End Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.clients?.list?.map((item) => {
              const localItem = {
                id: parseInt(item.idClient),
                profile: item.profile.Username.substring(0, 10),
                client: item.Name.substring(0, 15),
                description: item.Description.substring(0, 50),
                StartDate: new moment(item.StartDate).format(dateFormat),
                EndDate:
                  item.EndDate === null
                    ? ""
                    : new moment(item.EndDate).format(dateFormat),
              };
              return (
                <TableRow key={localItem.id}>
                  <TableCell>
                    <Link to={`/clients/${localItem.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>{localItem.profile}</TableCell>
                  <TableCell>{localItem.client}</TableCell>
                  <TableCell>{localItem.description}</TableCell>
                  <TableCell>{localItem.StartDate}</TableCell>
                  <TableCell>{localItem.EndDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Clients;
