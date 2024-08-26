import { useQuery } from "react-query";
import { getUserDetails } from "../services/apiAuthentication";
import { getUsers } from "../services/apiUser";

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

export function useUsers() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  if (error) {
    console.log("error", error);
  }
  return { isLoading, data };
}
