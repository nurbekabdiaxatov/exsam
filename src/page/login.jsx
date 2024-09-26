import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.token);
        toast.success("Login muvaffaqiyatli bo'ldi!");
        navigate("/"); 
      }
    } catch (error) {
      toast.error("Login muvaffaqiyatsiz. Iltimos, qayta urinib ko'ring!");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <div className="max-w-screen-xl w-full sm:m-10 sm:rounded-lg flex items-center justify-center flex-wrap">
        <div>
          <img src="./public/Login.jpg" alt="Flowbite" />
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="Login font-bold text-center">Login</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="Input w-full px-4 py-3 rounded-lg mt-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="Input w-full px-4 py-3 rounded-lg mt-4"
              required
            />
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
