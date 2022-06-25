import { gql, useQuery } from "@apollo/client";

const CLIENT_QUERY = gql`
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

const useGetClient = (_idClient) => {
  const { loading, error, data } = useQuery(CLIENT_QUERY, {
    variables: { idClient: _idClient },
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

export default useGetClient;
