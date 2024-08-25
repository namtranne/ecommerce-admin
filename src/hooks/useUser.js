import { useQuery } from "react-query";
import { getUserDetails } from "../services/apiAuthentication";

export function useUserDetails() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserDetails,
  });
  if (error) {
    console.log("error", error);
  }
  return { isLoading, data };
}
