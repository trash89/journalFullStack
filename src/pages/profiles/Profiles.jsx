import React from "react";
import { Link, Navigate } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";

import { useIsMounted } from "../../hooks";
import { TABLE_THEME, PAGINATION_STATE } from "../../utils/constants";
import { PaginationTable } from "../../components";

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

  const theme = useTheme(TABLE_THEME);

  const { loading, data } = useQuery(PROFILES_QUERY);
  const dataTable = { nodes: data?.profiles?.list };

  const sort = useSort(dataTable, null, {
    sortFns: {
      USERNAME: (array) =>
        array.sort((a, b) => a.Username.localeCompare(b.Username)),
      IS_ADMIN: (array) =>
        array.sort((a, b) => a.Is_Admin.localeCompare(b.Is_Admin)),
      KEEP: (array) => array.sort((a, b) => a.Keep.localeCompare(b.Keep)),
    },
  });
  const pagination = usePagination(dataTable, PAGINATION_STATE);

  if (!isMounted) return <></>;
  if (loading) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (!dataTable.nodes || dataTable.nodes === undefined) return <></>;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span></span>
        <span>Total: {data.profiles.count} rows</span>
      </div>

      <Table data={dataTable} sort={sort} pagination={pagination} theme={theme}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Actions</HeaderCell>
                <HeaderCellSort sortKey="USERNAME">Username</HeaderCellSort>
                <HeaderCellSort sortKey="IS_ADMIN">Admin?</HeaderCellSort>
                <HeaderCellSort sortKey="KEEP">Keep?</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item) => {
                const localItem = {
                  id: parseInt(item.idProfile),
                  Username: item.Username,
                  Is_Admin: item.Is_Admin,
                  Keep: item.Keep,
                };
                return (
                  <Row key={localItem.id} item={localItem}>
                    <Cell>
                      <Link to={`/profiles/${localItem.id}`}>
                        <EditIcon />
                      </Link>
                    </Cell>
                    <Cell>{localItem.Username}</Cell>
                    <Cell>{localItem.Is_Admin}</Cell>
                    <Cell>{localItem.Keep}</Cell>
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

export default Profiles;
