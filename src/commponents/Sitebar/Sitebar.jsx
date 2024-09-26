import { Sidebar } from "flowbite-react";
import {
  HiArrowSmLeft,
  HiChartPie,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Sitebar() {
  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("access_token");

      navigate("/login");
    };
  return (
    <div className="">
      <Sidebar aria-label="Sidebar with call to action button example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/">
              <Sidebar.Item icon={HiChartPie}>Dashboard</Sidebar.Item>
            </Link>
            <Link to="/user">
              <Sidebar.Item icon={HiUser}>Users</Sidebar.Item>
            </Link>
            <Sidebar.Item icon={HiViewBoards}>Kanban</Sidebar.Item>
            <Sidebar.Item onClick={handleLogout} icon={HiArrowSmLeft}>
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default Sitebar;
