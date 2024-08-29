import { useEffect, useState, type FC } from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import EcommerceInvoicePage from "./pages/e-commerce/invoice";
import EcommerceProductsPage from "./pages/e-commerce/products";
import KanbanPage from "./pages/kanban";
import MailingComposePage from "./pages/mailing/compose";
import MailingInboxPage from "./pages/mailing/inbox";
import MailingReadPage from "./pages/mailing/read";
import MailingReplyPage from "./pages/mailing/reply";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import MaintenancePage from "./pages/pages/maintenance";
import PricingPage from "./pages/pages/pricing";
import UserFeedPage from "./pages/users/feed";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import OrderPage from "./pages/e-commerce/order";
import { ConnectServerSocket } from "./hooks/useSocket";
import { toast } from "react-toastify";
import { getToken, isLogin } from "./utils/axios";
import SocketClientContext from "./context/SocketClientContext";
import SocketClient from "./socket/SocketClient";
const App: FC = function () {
  const [socketClient, setSocketClient] = useState<SocketClient | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      if (isLogin()) {
        const jwt = getToken();
        const client = new SocketClient("ws://127.0.0.1:8080/ws", jwt);

        client.client.onConnect = () => {
          console.log("Connected to STOMP server");

          // Subscribe to a global topic
          const subscription = client.subscribe(
            "/topic/admin",
            (message: any) => {
              console.log("Received admin message:", message.body);
              // Handle the message (e.g., update state, show notification)
              toast.info(`New admin message: ${message.body}`);
            }
          );

          // Store the client in state
          setSocketClient(client);
        };

        client.client.onStompError = (frame: any) => {
          console.error("STOMP error", frame.headers["message"]);
          console.error("Additional details:", frame.body);
          // toast.error("STOMP connection error");
        };

        try {
          await client.activate();
        } catch (err) {
          console.error("Cannot connect to chat server:", err);
          // toast.error("Cannot connect to chat server");
        }
      }
    };

    connectSocket();

    // Cleanup function
    return () => {
      if (socketClient) {
        console.log("Disconnecting from STOMP server");
        socketClient.deactivate();
      }
    };
  }, []);
  return (
    <SocketClientContext.Provider value={socketClient || {}}>
      <BrowserRouter>
        <Routes>
          <Route element={<FlowbiteWrapper />}>
            <Route path="/" element={<DashboardPage />} index />
            <Route path="/mailing/compose" element={<MailingComposePage />} />
            <Route path="/mailing/inbox" element={<MailingInboxPage />} />
            <Route path="/mailing/read" element={<MailingReadPage />} />
            <Route path="/mailing/reply" element={<MailingReplyPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/pages/pricing" element={<PricingPage />} />
            <Route path="/pages/maintenance" element={<MaintenancePage />} />
            <Route path="/pages/404" element={<NotFoundPage />} />
            <Route path="/pages/500" element={<ServerErrorPage />} />
            <Route path="/authentication/sign-in" element={<SignInPage />} />
            <Route
              path="/authentication/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/authentication/reset-password"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/authentication/profile-lock"
              element={<ProfileLockPage />}
            />
            {/* <Route
            path="/e-commerce/transactions"
            element={<EcommerceBillingPage />}
          /> */}
            <Route path="/e-commerce/orders" element={<OrderPage />} />
            <Route
              path="/e-commerce/invoice"
              element={<EcommerceInvoicePage />}
            />
            <Route
              path="/e-commerce/products"
              element={<EcommerceProductsPage />}
            />
            <Route path="/users/feed" element={<UserFeedPage />} />
            <Route path="/users/list" element={<UserListPage />} />
            <Route path="/users/profile/:id" element={<UserProfilePage />} />
            <Route path="/users/settings" element={<UserSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketClientContext.Provider>
  );
};

export default App;
