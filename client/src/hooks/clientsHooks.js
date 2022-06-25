import { gql, useQuery } from "@apollo/client";

const useGetClient = (id) => {
  const QUERY = gql`
    query clientQuery($idClient: ID!) {
      client(idClient: $idClient) {
        idProfile
        idClient
        Name
        Description
        StartDate
        EndDate
      }
    }
  `;

  const { loading, error, data } = useQuery(QUERY, {
    variables: { idClient: id },
  });
  if (loading || error) return { idProfile: -1, idClient: -1, Name: "", Description: "", StartDate: "", EndDate: "" };
  return {
    idProfile: data?.client?.idProfile,
    idClient: data?.client?.idClient,
    Name: data?.client?.Name,
    Description: data?.client?.Description,
    StartDate: data?.client?.StartDate,
    EndDate: data?.client?.EndDate,
  };
};

const useClientsList = () => {
  const QUERY = gql`
    query clientsQuery {
      clients {
        count
        list {
          idClient
          Name
        }
      }
    }
  `;

  const { loading, error, data: clientsList } = useQuery(QUERY);
  if (loading || error) return [];
  const clientsArray = clientsList?.clients?.list?.map((client) => {
    return { idClient: client?.idClient, Name: client?.Name };
  });
  return clientsArray;
};

export { useGetClient, useClientsList };
