/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState, type FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import SocketClientContext from "../../context/SocketClientContext";
import { Button } from "flowbite-react";
import authAxios from "../../utils/axios";
import { FooterDivider } from "flowbite-react/lib/esm/components/Footer/FooterDivider";

const MailingInboxPage: FC = function () {
  const [conversations, setConversations] = useState([]);
  const [isChatScreen, setIsChatScreen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const handleSwitchScreen = () => {
    setIsChatScreen((prev) => !prev);
  };
  useEffect(() => {
    const fetchConversations = async () => {
      const data = await authAxios.get("/admin/chat");
      console.log(data);
      setConversations(data.data.conversations);
    };
    fetchConversations();
  }, []);
  return (
    <NavbarSidebarLayout isFooter={false}>
      {!isChatScreen &&
        conversations.map((conversation: any) => {
          return (
            <Conversation
              conversation={conversation}
              key={conversation.id}
              handleSwitchScreen={handleSwitchScreen}
              setSelectedConversation={setSelectedConversation}
            />
          );
        })}

      {isChatScreen && (
        <Chat
          handleSwitchScreen={handleSwitchScreen}
          selectedConversation={selectedConversation}
        />
      )}
    </NavbarSidebarLayout>
  );
};

const Conversation = function ({
  conversation,
  handleSwitchScreen,
  setSelectedConversation,
}: any) {
  // const { client }: any = useContext(SocketClientContext); // Removed explicit 'any' type
  // const [message, setMessage] = useState("");

  // const handleSendMessage = () => {
  //   if (!message.trim()) {
  //     console.log("Message is empty");
  //     return;
  //   }

  //   try {
  //     client.publish({
  //       destination: `/app/chat/sendMessage/${123}`,
  //       body: JSON.stringify({
  //         messageType: "CHAT",
  //         content: message,
  //         receiverId: 123,
  //         receiverUsername: 123,
  //       }),
  //     });
  //     console.log("Message sent:", message);
  //   } catch (e) {
  //     console.error("Failed to send message:", e);
  //   }
  //   setMessage(""); // Clear message input after sending
  // };

  // useEffect(() => {
  //   if (!client) {
  //     console.log("No client available for WebSocket connection");
  //     return;
  //   }

  //   console.log("Subscribing to topic: /topic/admin");
  //   const subscription = client.subscribe("/topic/admin", (data: any) => {
  //     const binaryBody = data._binaryBody;
  //     let receivedMessage = "";

  //     for (const key in binaryBody) {
  //       receivedMessage += String.fromCharCode(binaryBody[key]);
  //     }

  //     console.log("Received message:", receivedMessage);
  //   });

  //   return () => {
  //     if (subscription) {
  //       console.log("Unsubscribing from topic: /topic/admin");
  //       subscription.unsubscribe();
  //     }
  //   };
  // }, [client]); // Added dependency array to effect

  return (
    <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
      <div className="flex items-start gap-2.5">
        <img
          className="w-8 h-8 rounded-full"
          src="https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
          alt="Jese image"
        />
        <div className="flex flex-col w-full max-w-[320px] leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              User id: {conversation.userId}
            </span>
            <span
              className={`text-sm font-normal text-gray-500 dark:text-gray-400 `}
            >
              {conversation.updatedAt}
            </span>
          </div>
          <p
            className={`text-sm font-normal py-2 text-gray-900 dark:text-white text-xl`}
            style={{ fontWeight: conversation.lastMessage.isRead ? 400 : 700 }}
          >
            {conversation.lastMessage.messageText}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          title="Send Message"
          onClick={() => {
            handleSwitchScreen();
            setSelectedConversation(conversation);
          }}
        >
          Reply this user
        </Button>
      </div>
    </div>
  );
};

const Chat = ({ handleSwitchScreen, selectedConversation }: any) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { client }: any = useContext(SocketClientContext);
  const handleSendMessage = () => {
    try {
      client.publish(
        `/app/chat/sendMessage/${selectedConversation.userId}`,
        message
      );
    } catch (e) {
      console.log(e);
    }
    setMessage("");
  };
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await authAxios.get("auth/conversation", {
        params: {
          conversationId: selectedConversation.id,
        },
      });
      console.log(data);
      setMessages(data.data);
    };
    fetchMessages();
  }, []);
  return (
    <div className="p-2">
      <div className="flex w-full justify-center items-center mt-2">
        <p className="font-bold text-xl">
          User ID: {selectedConversation.userId}
        </p>
        <Button
          title="Send Message"
          onClick={() => handleSwitchScreen()}
          className="absolute left-2"
        >
          Go Back
        </Button>
      </div>
      <FooterDivider />
      <div className="h-full overflow-scroll">
        {messages.map((message: any) => {
          return (
            <div>
              <div className="flex items-start gap-2.5">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
                  alt="Jese image"
                />
                <div className="flex flex-col w-full max-w-[320px] leading-1.5">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      User ID: {message.senderId}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {message.createdAt}
                    </span>
                  </div>
                  <p className="text-sm font-normal py-2 text-gray-900 dark:text-white">
                    {" "}
                    {message.messageText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full">
        <input
          type="text"
          placeholder="type to reply..."
          className="flex-1 border-blue-200"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button className="ml-4" onClick={() => handleSendMessage()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default MailingInboxPage;
