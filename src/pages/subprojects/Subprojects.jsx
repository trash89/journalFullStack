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

const SUBPROJECTS_QUERY = gql`
  query subprojectsQuery {
    subprojects(orderBy: { Name: asc }) {
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

  const { loading, data } = useQuery(SUBPROJECTS_QUERY);

  if (!isMounted) return <></>;
  if (loading) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!data || data === undefined) return <></>;
  return (
    <div>
      <TotalRows
        link="/subprojects/newsubproject"
        count={data.subprojects.count}
      />
      <TableContainer component={Paper}>
        <Table aria-label="projects" size="small">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Actions
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
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Def?
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Start Date
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                End Date
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Fin?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.subprojects?.list?.map((item) => {
              const localItem = {
                id: parseInt(item.idSubproject),
                client: item.client.Name.substring(0, 15),
                project: item.project.Name.substring(0, 15),
                subproject: item.Name.substring(0, 15),
                description: item.Description.substring(0, 50),
                isDefault: item.isDefault === "Y" ? "Yes" : "No",
                StartDate: new moment(item.StartDate).format(dateFormat),
                EndDate:
                  item.EndDate === null
                    ? ""
                    : new moment(item.EndDate).format(dateFormat),
                Finished: item.Finished === "Y" ? "Yes" : "No",
              };
              return (
                <TableRow key={localItem.id}>
                  <TableCell>
                    <Link to={`/subprojects/${localItem.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>{localItem.client}</TableCell>
                  <TableCell>{localItem.project}</TableCell>
                  <TableCell>{localItem.subproject}</TableCell>
                  <TableCell>{localItem.description}</TableCell>
                  <TableCell>{localItem.isDefault}</TableCell>
                  <TableCell>{localItem.StartDate}</TableCell>
                  <TableCell>{localItem.EndDate}</TableCell>
                  <TableCell>{localItem.Finished}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Subprojects;
