import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Component() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    navigate("/login");
  };

  return (
    <>
      <Navbar fluid rounded className="">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
    </>
  );
}

export default Component;
