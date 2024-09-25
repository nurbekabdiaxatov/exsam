import { Outlet } from "react-router-dom";
import Navbar from "../commponents/Navbar/Navbar";
import Sitebar from "../commponents/Sitebar/Sitebar";
function mainlayout() {
  return (
    <div className="">
      <Navbar />
      <div className="flex h-screen  ">
        <Sitebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default mainlayout;
