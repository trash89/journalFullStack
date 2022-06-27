import { gql, useQuery } from "@apollo/client";

const useGetJournal = (id) => {
  const QUERY = gql`
    query entityQuery($idJournal: ID!) {
      journal(idJournal: $idJournal) {
        idProfile
        idClient
        idProject
        idSubproject
        idJournal
        EntryDate
        Description
        Todos
        ThingsDone
        DocUploaded
      }
    }
  `;

  const { loading, error, data } = useQuery(QUERY, {
    variables: { idJournal: id },
  });
  if (error)
    return {
      loading: loading,
      idProfile: -1,
      idClient: -1,
      idProject: -1,
      idSubproject: -1,
      idJournal: -1,
      EntryDate: "",
      Description: "",
      Todos: "N",
      ThingsDone: "",
      DocUploaded: "",
    };

  return {
    loading: loading,
    idProfile: data?.journal?.idProfile,
    idClient: data?.journal?.idClient,
    idProject: data?.journal?.idProject,
    idSubproject: data?.journal?.idSubproject,
    idJournal: data?.journal?.idSubproject,
    EntryDate: data?.journal?.EntryDate,
    Description: data?.journal?.Description,
    Todos: data?.journal?.Todos,
    ThingsDone: data?.journal?.ThingsDone,
    DocUploaded: data?.journal?.DocUploaded,
  };
};

const useJournalsList = () => {
  const QUERY = gql`
    query entityQuery {
      journals {
        count
        list {
          idJournal
          EntryDate
        }
      }
    }
  `;

  const { loading, error, data: List } = useQuery(QUERY);
  if (error) return [];
  const entityArray = List?.journals?.list?.map((item) => {
    return { idJournal: item?.idJournal, EntryDate: item?.EntryDate };
  });
  return { loading: loading, list: entityArray };
};

export { useGetJournal, useJournalsList };
