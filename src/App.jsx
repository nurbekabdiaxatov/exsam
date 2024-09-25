import "./App.css";
import Home from "./page/home";
import About from "./page/about";
import Users from "./page/user";
import Login from "./page/login"; // Assuming you have a login component
import Register from "./page/register"; // Assuming you have a register component
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/mainlayout";

function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Users />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />, // Login page route
    },
    {
      path: "/register",
      element: <Register />, // Register page route
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
