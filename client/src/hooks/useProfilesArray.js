import { gql, useQuery } from "@apollo/client";

const PROFILES_QUERY = gql`
  query profilesQuery {
    profiles {
      count
      list {
        idProfile
        Username
        Is_Admin
      }
    }
  }
`;

const useProfilesArray = () => {
  const { loading, error, data: profilesList } = useQuery(PROFILES_QUERY);
  if (loading || error) return [];
  const profilesArray = profilesList?.profiles?.list?.map((profile) => profile?.idProfile);

  return profilesArray;
};

export default useProfilesArray;
