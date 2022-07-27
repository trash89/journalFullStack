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

import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";

import moment from "moment";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { clearValues } from "../../features/project/projectSlice";
import { TotalRows } from "../../components";

const PROJECTS_QUERY = gql`
  query projectsQuery {
    projects(orderBy: { Name: asc }) {
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
  const dispatch = useDispatch();

  const { loading, data } = useQuery(PROJECTS_QUERY);

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
      <TotalRows link="/projects/newproject" count={data.projects.count} />

      <TableContainer component={Paper} sx={{ maxHeight: 440, maxWidth: 1100 }}>
        <Table aria-label="projects" size="small" stickyHeader>
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
            {data?.projects?.list?.map((item) => {
              const localItem = {
                id: parseInt(item.idProject),
                client: item.client.Name.substring(0, 15),
                project: item.Name.substring(0, 15),
                description: item.Description.substring(0, 50),
                isDefault: item.isDefault === "Y" ? "Yes" : "No",
                StartDate: new moment(item.StartDate).format(dateFormat),
                EndDate: item.EndDate === null ? "" : new moment(item.EndDate).format(dateFormat),
                Finished: item.Finished === "Y" ? "Yes" : "No",
              };
              return (
                <TableRow key={localItem.id}>
                  <TableCell>
                    <Link to={`/projects/${localItem.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>{localItem.client}</TableCell>
                  <TableCell>{localItem.project}</TableCell>
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

export default Projects;
