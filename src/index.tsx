import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}
const queryClient = new QueryClient();
const root = createRoot(container);

root.render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
