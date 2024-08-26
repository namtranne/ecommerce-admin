import { useQuery } from "react-query";
import { getAllOrders } from "../services/apiOrder";
import { toast } from "react-toastify";

export function useOrders() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
  if (error) {
    console.log("error", error);
    toast.error("There was an error fetching orders");
  }
  return { isLoading, data };
}
