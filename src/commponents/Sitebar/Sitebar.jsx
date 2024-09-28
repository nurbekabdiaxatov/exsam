import { Link, useLocation } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { HiChartPie, HiTable, HiArrowSmLeft, HiUser } from "react-icons/hi"; // HiUser qo'shildi
import "./sitebar.css";
import Logo from "../../../public/Logo.png";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img src={Logo} className="sidebar-logo" alt="Favicon" />
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
            <Link
              to="/about"
              className={`${isActive("/about") ? "active" : ""}`}
            >
              <HiTable className="icon" />
              <span className="text">Create</span>
            </Link>
          </li>

          <li>
            <Link to="/user" className={`${isActive("/user") ? "active" : ""}`}>
              <HiUser className="icon" /> {/* Bu yerda HiUser ishlatilmoqda */}
              <span className="text">Users</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer flex justify-between">
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
          className="button1"
        >
          <HiArrowSmLeft className="icon" />
          <span className="text">Logout</span>
        </button>
        <Avatar
          alt="User settings"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          rounded
        />
      </div>
    </div>
  );
};

export default Sidebar;
