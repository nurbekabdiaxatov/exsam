import { Outlet } from "react-router-dom";
import Sitebar from "../commponents/Sitebar/Sitebar";
function mainlayout() {
  return (
    <div className="h-screen flex">
      <Sitebar /> 
      <main className="flex-1 h-screen overflow-auto">
        <div className="flex justify-end p-4 fixed">
        </div>
        <div className="p-4 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default mainlayout;
