import { gql, useQuery } from "@apollo/client";

const PROFILE_QUERY = gql`
  query profileQuery($idProfile: ID!) {
    profile(idProfile: $idProfile) {
      Is_Admin
    }
  }
`;

const useIsAdmin = (idProfile) => {
  const { loading, error, data } = useQuery(PROFILE_QUERY, {
    variables: { idProfile: idProfile },
  });
  if (loading || error) return null;
  return data?.profile?.Is_Admin || "N";
};

export default useIsAdmin;
