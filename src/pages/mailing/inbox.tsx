/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState, type FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import SocketClientContext from "../../context/SocketClientContext";
import { Button } from "flowbite-react";
import authAxios from "../../utils/axios";

const MailingInboxPage: FC = function () {
  useEffect(() => {
    const fetchConversations = async () => {
      const data = await authAxios.get("/admin/chat");
      console.log(data);
    };
    fetchConversations();
  }, []);
  return (
    <NavbarSidebarLayout isFooter={false}>
      <Inbox />
    </NavbarSidebarLayout>
  );
};

const Inbox: FC = function () {
  const { client }: any = useContext(SocketClientContext); // Removed explicit 'any' type
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    try {
      client.publish({
        destination: `/app/chat/sendMessage/${123}`,
        body: JSON.stringify({
          messageType: "CHAT",
          content: message,
          receiverId: 123,
          receiverUsername: 123,
        }),
      });
      console.log("Message sent:", message);
    } catch (e) {
      console.error("Failed to send message:", e);
    }
    setMessage(""); // Clear message input after sending
  };

  useEffect(() => {
    if (!client) {
      console.log("No client available for WebSocket connection");
      return;
    }

    console.log("Subscribing to topic: /topic/admin");
    const subscription = client.subscribe("/topic/admin", (data: any) => {
      const binaryBody = data._binaryBody;
      let receivedMessage = "";

      for (const key in binaryBody) {
        receivedMessage += String.fromCharCode(binaryBody[key]);
      }

      console.log("Received message:", receivedMessage);
    });

    return () => {
      if (subscription) {
        console.log("Unsubscribing from topic: /topic/admin");
        subscription.unsubscribe();
      }
    };
  }, [client]); // Added dependency array to effect

  return (
    <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
      <div className="flex items-start gap-2.5">
        <img
          className="w-8 h-8 rounded-full"
          src="/docs/images/people/profile-picture-3.jpg"
          alt="Jese image"
        />
        <div className="flex flex-col w-full max-w-[320px] leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Bonnie Green
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              11:46
            </span>
          </div>
          <p className="text-sm font-normal py-2 text-gray-900 dark:text-white">
            {" "}
            That's awesome. I think our users will really appreciate the
            improvements.
          </p>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Delivered
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <Button onClick={handleSendMessage} title="Send Message">
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default MailingInboxPage;
