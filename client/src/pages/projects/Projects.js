import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { useSort, HeaderCellSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import moment from "moment";

import { useIsMounted } from "../../hooks";
import { dateFormat, TABLE_THEME, PAGINATION_STATE } from "../../utils/constants";
import { PaginationTable } from "../../components";
import { clearValues } from "../../features/project/projectSlice";

const PROJECTS_QUERY = gql`
  query projectsQuery {
    projects {
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

  const theme = useTheme({
    ...TABLE_THEME,
    BaseCell: `
        &:nth-of-type(1) {
          min-width: 5%;
          width: 5%;
        }
        &:nth-of-type(2) {
          min-width: 15%;
          width: 15%;
        }
        &:nth-of-type(3) {
          min-width: 15%;
          width: 15%;
        }
        &:nth-of-type(4) {
          min-width: 39%;
          width: 39%;
        }
        &:nth-of-type(5) {
          min-width: 5%;
          width: 5%;
        }
        &:nth-of-type(6) {
          min-width: 7%;
          width: 7%;
        }
        &:nth-of-type(7) {
          min-width: 7%;
          width: 7%;
        }
        &:nth-of-type(8) {
          min-width: 7%;
          width: 7%;
        }
      `,
  });

  const { data } = useQuery(PROJECTS_QUERY);
  const dataTable = { nodes: data?.projects?.list };

  const sort = useSort(dataTable, null, {
    sortFns: {
      CLIENT: (array) => array.sort((a, b) => a.client.Name.localeCompare(b.client.Name)),
      PROJECT: (array) => array.sort((a, b) => a.Name.localeCompare(b.Name)),
      DESCRIPTION: (array) => array.sort((a, b) => a.Description.localeCompare(b.Description)),
      ISDEFAULT: (array) => array.sort((a, b) => a.isDefault.localeCompare(b.isDefault)),
      STARTDATE: (array) => array.sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate)),
      ENDDATE: (array) => array.sort((a, b) => new Date(a.EndDate) - new Date(b.EndDate)),
      FINISHED: (array) => array.sort((a, b) => a.Finished.localeCompare(b.Finished)),
    },
  });
  const pagination = usePagination(dataTable, PAGINATION_STATE);

  useEffect(() => {
    dispatch(clearValues());
  }, []);

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!dataTable.nodes || dataTable.nodes === undefined) return <></>;
  return (
    <div style={{ height: "350px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <Link to="/projects/newproject">
            <AddIcon />
          </Link>
        </span>
        <span>Total: {data.projects.count} rows</span>
      </div>

      <Table data={dataTable} theme={theme} sort={sort} pagination={pagination} layout={{ custom: true }}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Actions</HeaderCell>
                <HeaderCellSort sortKey="CLIENT">Client</HeaderCellSort>
                <HeaderCellSort sortKey="PROJECT">Project</HeaderCellSort>
                <HeaderCellSort sortKey="DESCRIPTION">Description</HeaderCellSort>
                <HeaderCellSort sortKey="ISDEFAULT">Def?</HeaderCellSort>
                <HeaderCellSort sortKey="STARTDATE">Start Date</HeaderCellSort>
                <HeaderCellSort sortKey="ENDDATE">End Date</HeaderCellSort>
                <HeaderCellSort sortKey="FINISHED">Fin?</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item) => {
                const localItem = {
                  id: parseInt(item.idProject),
                  client: item.client.Name,
                  project: item.Name,
                  description: item.Description,
                  isDefault: item.isDefault === "Y" ? "Yes" : "No",
                  StartDate: new moment(item.StartDate).format(dateFormat),
                  EndDate: item.EndDate === null ? "" : new moment(item.EndDate).format(dateFormat),
                  Finished: item.Finished === "Y" ? "Yes" : "No",
                };
                return (
                  <Row key={localItem.id} item={localItem}>
                    <Cell>
                      <Link to={`/projects/${localItem.id}`}>
                        <EditIcon />
                      </Link>
                    </Cell>
                    <Cell>{localItem.client}</Cell>
                    <Cell>{localItem.project}</Cell>
                    <Cell>{localItem.description}</Cell>
                    <Cell>{localItem.isDefault}</Cell>
                    <Cell>{localItem.StartDate}</Cell>
                    <Cell>{localItem.EndDate}</Cell>
                    <Cell>{localItem.Finished}</Cell>
                  </Row>
                );
              })}
            </Body>
          </>
        )}
      </Table>
      <PaginationTable pagination={pagination} data={dataTable} />
    </div>
  );
};

export default Projects;
