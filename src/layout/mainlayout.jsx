import { Outlet } from "react-router-dom";
import Navbar from "../commponents/Navbar/Navbar";
import Sitebar from "../commponents/Sitebar/Sitebar";
function mainlayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Sitebar />
    </div>
  );
}

export default mainlayout;
