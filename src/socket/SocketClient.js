import { Client } from "@stomp/stompjs";

class SocketClient {
  constructor(url, jwt) {
    this.url = url;
    this.jwt = jwt;
    this.connected = false;
    this.client = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        this.connected = true;
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });
  }

  async activate() {
    await this.client.activate();
  }

  deactivate() {
    this.client.deactivate();
  }

  subscribe(destination, callback) {
    return this.client.subscribe(destination, (message) => {
      callback(message);
    });
  }

  publish(destination, body) {
    // console.log(123);
    this.client.publish(destination, JSON.stringify(body));
  }
}

export default SocketClient;
