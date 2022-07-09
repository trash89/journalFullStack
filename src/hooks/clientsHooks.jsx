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
  if (error)
    return {
      loading: loading,
      idProfile: -1,
      idClient: -1,
      Name: "",
      Description: "",
      StartDate: "",
      EndDate: "",
    };
  return {
    loading: loading,
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
    query entityQuery {
      clients {
        count
        list {
          idClient
          Name
        }
      }
    }
  `;

  const { loading, error, data: List } = useQuery(QUERY);
  if (error) return [];
  const entityArray = List?.clients?.list?.map((item) => {
    return { idClient: item?.idClient, Name: item?.Name };
  });
  return { loading: loading, list: entityArray };
};

export { useGetClient, useClientsList };
