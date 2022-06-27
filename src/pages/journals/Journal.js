import { Link, Navigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { useSort, HeaderCellSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import moment from "moment";

import { useIsMounted } from "../../hooks";
import { dateFormat, TABLE_THEME, PAGINATION_STATE } from "../../utils/constants";
import { PaginationTable } from "../../components";

const JOURNALS_QUERY = gql`
  query journalsQuery {
    journals(orderBy: { EntryDate: desc }) {
      count
      list {
        idProfile
        idClient
        idProject
        idSubproject
        idJournal
        EntryDate
        Description
        Todos
        ThingsDone
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

  const theme = useTheme({
    ...TABLE_THEME,
    BaseCell: `
        &:nth-of-type(1) {
          min-width: 5%;
          width: 5%;
        }
        &:nth-of-type(2) {
          min-width: 10%;
          width: 10%;
        }
        &:nth-of-type(3) {
          min-width: 35%;
          width: 35%;
        }
        &:nth-of-type(4) {
          min-width: 10%;
          width: 10%;
        }
        &:nth-of-type(5) {
          min-width: 10%;
          width: 10%;
        }
        &:nth-of-type(6) {
          min-width: 15%;
          width: 15%;
        }
        &:nth-of-type(7) {
          min-width: 15%;
          width: 15%;
        }

      `,
  });

  const { data } = useQuery(JOURNALS_QUERY);
  const dataTable = { nodes: data?.journals?.list };

  const sort = useSort(dataTable, null, {
    sortFns: {
      ENTRYDATE: (array) => array.sort((a, b) => new Date(a.EntryDate) - new Date(b.EntryDate)),
      DESCRIPTION: (array) => array.sort((a, b) => a.Description.localeCompare(b.Description)),
      PROFILE: (array) => array.sort((a, b) => a.profile.Username.localeCompare(b.profile.Username)),
      CLIENT: (array) => array.sort((a, b) => a.client.Name.localeCompare(b.profile.Name)),
      PROJECT: (array) => array.sort((a, b) => a.project.Name.localeCompare(b.project.Name)),
      SUBPROJECT: (array) => array.sort((a, b) => a.subproject.Name.localeCompare(b.subproject.Name)),
    },
  });
  const pagination = usePagination(dataTable, PAGINATION_STATE);

  const escapeCsvCell = (cell) => {
    if (cell == null) {
      return "";
    }
    const sc = cell.toString().trim();
    if (sc === "" || sc === '""') {
      return sc;
    }
    if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
      return '"' + sc.replace(/"/g, '""') + '"';
    }
    return sc;
  };

  const makeCsvData = (columns, data) => {
    return data.reduce((csvString, rowItem) => {
      return csvString + columns.map(({ accessor }) => escapeCsvCell(accessor(rowItem))).join(",") + "\r\n";
    }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
  };

  const downloadAsCsv = (columns, data, filename) => {
    const csvData = makeCsvData(columns, data);
    const csvFile = new Blob([csvData], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.display = "none";
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.EntryDate, name: "EntryDate" },
      { accessor: (item) => item.Description, name: "Description" },
      { accessor: (item) => item.Todos, name: "Todos" },
      { accessor: (item) => item.ThingsDone, name: "ThingsDone" },
      { accessor: (item) => item.client.Name, name: "Client" },
      { accessor: (item) => item.project.Name, name: "Project" },
      { accessor: (item) => item.subproject.Name, name: "Subproject" },
    ];

    downloadAsCsv(columns, dataTable.nodes, "table");
  };

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!dataTable.nodes || dataTable.nodes === undefined) return <></>;
  return (
    <div style={{ height: "350px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <Link to="/journals/newjournal">
            <AddIcon />
          </Link>
        </span>
        <Button type="button" onClick={handleDownloadCsv}>
          Download as CSV
        </Button>

        <span>Total: {data.journals.count} rows</span>
      </div>
      <Table data={dataTable} theme={theme} sort={sort} pagination={pagination} layout={{ custom: true }}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Actions</HeaderCell>
                <HeaderCellSort sortKey="ENTRYDATE">Entry Date</HeaderCellSort>
                <HeaderCellSort sortKey="DESCRIPTION">Description</HeaderCellSort>
                <HeaderCellSort sortKey="PROFILE">Profile</HeaderCellSort>
                <HeaderCellSort sortKey="CLIENT">Client</HeaderCellSort>
                <HeaderCellSort sortKey="PROJECT">Project</HeaderCellSort>
                <HeaderCellSort sortKey="SUBPROJECT">Subproject</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item) => {
                const localItem = {
                  id: parseInt(item.idJournal),
                  entryDate: new moment(item.EntryDate).format(dateFormat),
                  description: item.Description.substring(0, 50),
                  profile: item.profile.Username.substring(0, 10),
                  client: item.client.Name.substring(0, 15),
                  project: item.project.Name.substring(0, 15),
                  subproject: item.subproject.Name.substring(0, 15),
                };
                return (
                  <Row key={localItem.id} item={localItem}>
                    <Cell>
                      <Link to={`/journals/${localItem.id}`}>
                        <EditIcon />
                      </Link>
                    </Cell>
                    <Cell>{localItem.entryDate}</Cell>
                    <Cell>{localItem.description}</Cell>
                    <Cell>{localItem.profile}</Cell>
                    <Cell>{localItem.client}</Cell>
                    <Cell>{localItem.project}</Cell>
                    <Cell>{localItem.subproject}</Cell>
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

export default Journal;
