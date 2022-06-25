import { gql, useQuery } from "@apollo/client";

const useGetProject = (id) => {
  const QUERY = gql`
    query entityQuery($idProject: ID!) {
      project(idProject: $idProject) {
        idClient
        idProject
        Name
        Description
        isDefault
        StartDate
        EndDate
        Finished
      }
    }
  `;

  const { loading, error, data } = useQuery(QUERY, {
    variables: { idProject: id },
  });
  if (loading || error) return { idClient: -1, idProject: -1, Name: "", Description: "", isDefault: "N", StartDate: "", EndDate: "", Finished: "N" };
  return {
    idClient: data?.project?.idClient,
    idProject: data?.project?.idProject,
    Name: data?.project?.Name,
    Description: data?.project?.Description,
    isDefault: data?.project?.isDefault,
    StartDate: data?.client?.StartDate,
    EndDate: data?.client?.EndDate,
    Finished: data?.client?.Finished,
  };
};

export { useGetProject };
