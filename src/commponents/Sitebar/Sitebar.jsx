import { Link, useLocation } from "react-router-dom";
import {
  HiChartPie,
  HiUser,
  HiViewBoards,
  HiArrowSmLeft,
} from "react-icons/hi";
import "./sitebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img
          src="../../../public/Logo.png"
          className="sidebar-logo"
          alt="Favicon"
        />
        <span className="sidebar-title">Panel</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`${isActive("/") ? "active" : ""}`}>
              <HiChartPie className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/user" className={`${isActive("/user") ? "active" : ""}`}>
              <HiUser className="icon" />
              <span className="text">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/kanban"
              className={`${isActive("/kanban") ? "active" : ""}`}
            >
              <HiViewBoards className="icon" />
              <span className="text">Kanban</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
        >
          <HiArrowSmLeft className="icon" />
          <span className="text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
