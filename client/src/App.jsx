import ChatBot from "./Chat";
import Login from "./Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/chat/:email", element: <ChatBot /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
