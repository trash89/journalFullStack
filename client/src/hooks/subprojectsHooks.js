import { gql, useQuery } from "@apollo/client";

const useGetSubproject = (id) => {
  const QUERY = gql`
    query entityQuery($idSubproject: ID!) {
      subproject(idSubproject: $idSubproject) {
        idClient
        idProject
        idSubproject
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
    variables: { idSubproject: id },
  });
  if (loading || error)
    return { idClient: -1, idProject: -1, idSubproject: -1, Name: "", Description: "", isDefault: "N", StartDate: "", EndDate: "", Finished: "N" };

  return {
    idClient: data?.subproject?.idClient,
    idProject: data?.subproject?.idProject,
    idSubproject: data?.subproject?.idSubproject,
    Name: data?.subproject?.Name,
    Description: data?.subproject?.Description,
    isDefault: data?.subproject?.isDefault,
    StartDate: data?.subproject?.StartDate,
    EndDate: data?.subproject?.EndDate,
    Finished: data?.subproject?.Finished,
  };
};

const useSubprojectsList = () => {
  const QUERY = gql`
    query entityQuery {
      subprojects {
        count
        list {
          idSubproject
          Name
        }
      }
    }
  `;

  const { loading, error, data: List } = useQuery(QUERY);
  if (loading || error) return [];
  const entityArray = List?.subprojects?.list?.map((item) => {
    return { idSubproject: item?.idSubproject, Name: item?.Name };
  });
  return entityArray;
};

export { useGetSubproject, useSubprojectsList };
