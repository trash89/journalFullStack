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
  if (error) return { loading: loading, idClient: -1, idProject: -1, Name: "", Description: "", isDefault: "N", StartDate: "", EndDate: "", Finished: "N" };
  return {
    loading: loading,
    idClient: data?.project?.idClient,
    idProject: data?.project?.idProject,
    Name: data?.project?.Name,
    Description: data?.project?.Description,
    isDefault: data?.project?.isDefault,
    StartDate: data?.project?.StartDate,
    EndDate: data?.project?.EndDate,
    Finished: data?.project?.Finished,
  };
};

const useProjectsList = () => {
  const QUERY = gql`
    query entityQuery {
      projects {
        count
        list {
          idProject
          Name
        }
      }
    }
  `;

  const { loading, error, data: List } = useQuery(QUERY);
  if (error) return [];
  const entityArray = List?.projects?.list?.map((item) => {
    return { idProject: item?.idProject, Name: item?.Name };
  });
  return { loading: loading, list: entityArray };
};

export { useGetProject, useProjectsList };
