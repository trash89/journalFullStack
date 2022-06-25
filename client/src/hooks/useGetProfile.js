import { gql, useQuery } from "@apollo/client";

const PROFILE_QUERY = gql`
  query profileQuery($idProfile: ID!) {
    profile(idProfile: $idProfile) {
      idProfile
      Username
      Is_Admin
    }
  }
`;

const useGetProfile = (idProfile) => {
  const { loading, error, data } = useQuery(PROFILE_QUERY, {
    variables: { idProfile: idProfile },
  });
  if (loading || error) return { idProfile: -1, Username: "", Is_Admin: "N" };
  return { idProfile: data?.profile?.idProfile, Username: data?.profile?.Username, Is_Admin: data?.profile?.Is_Admin };
};

export default useGetProfile;
