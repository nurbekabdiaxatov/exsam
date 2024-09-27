import "./App.css";
import Home from "./page/home";
import About from "./page/about";
import Users from "./page/user";
import Login from "./page/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/mainlayout";
import ProtectedRoute from "./commponents/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ), 
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
          path: "/user",
          element: <Users />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />, 
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
