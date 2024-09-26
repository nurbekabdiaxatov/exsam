import { Outlet } from "react-router-dom";
import Navbar from "../commponents/Navbar/Navbar";
import Sitebar from "../commponents/Sitebar/Sitebar";
function mainlayout() {
  return (
    <div className="h-screen flex">
      <Sitebar /> {/* Sidebar will take up its default width */}
      <main className="flex-1 h-screen overflow-auto">
        <div className="flex justify-end p-4">
          <Navbar /> {/* Align Navbar to the right */}
        </div>
        <div className="p-4">
          <Outlet /> {/* Routed content */}
        </div>
      </main>
    </div>
  );
}

export default mainlayout;
