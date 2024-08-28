import { getToken, isLogin } from "../utils/axios";
import SocketClient from "../socket/SocketClient";
import { useQuery } from "react-query";

export async function ConnectServerSocket() {
  if (isLogin() == false) {
    return null;
  } else {
    const jwt = getToken();
    console.log(jwt);
    const client = new SocketClient("ws://127.0.0.1:8080/ws", jwt);
    await client.activate();
    return client;
  }
}

export function useSocket() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["socket"],
    queryFn: ConnectServerSocket,
  });

  if (isLoading) {
    console.log("Connecting to server socket...");
  }

  if (error) {
    console.log("Error connecting to server socket:", error);
  }

  return data;
}
