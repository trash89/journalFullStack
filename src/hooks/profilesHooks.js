import { gql, useQuery } from "@apollo/client";

const useGetProfile = (id) => {
  const QUERY = gql`
    query profileQuery($idProfile: ID!) {
      profile(idProfile: $idProfile) {
        idProfile
        Username
        Is_Admin
      }
    }
  `;

  const { loading, error, data } = useQuery(QUERY, {
    variables: { idProfile: id },
  });
  if (loading || error) return { idProfile: -1, Username: "", Is_Admin: "N" };
  return { idProfile: data?.profile?.idProfile, Username: data?.profile?.Username, Is_Admin: data?.profile?.Is_Admin };
};

const useProfilesArray = () => {
  const QUERY = gql`
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

  const { loading, error, data: profilesList } = useQuery(QUERY);
  if (loading || error) return [];
  const profilesArray = profilesList?.profiles?.list?.map((profile) => profile?.idProfile);
  return profilesArray;
};

export { useGetProfile, useProfilesArray };
