import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { Toaster, toast } from "sonner"; // Sonner kutubxonasidan import qilish

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
      console.log("Login Successful:", response.data);

      // Store the access token in local storage
      localStorage.setItem("access_token", response.data.access_token);

      // Muvaffaqiyatli login xabari
      toast.success("Login Successful!");

      // Redirect to home page
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("Login Error: " + errorMessage);

      // Xatolik bo'lsa to'liq xabar chiqarish
      toast.error(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <div className="max-w-screen-xl w-full sm:m-10 sm:rounded-lg flex items-center justify-center flex-wrap">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="Login font-bold text-center">Login</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`Input w-full px-4 py-3 rounded-lg mt-4 ${
                error ? "border-red-500" : ""
              }`}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`Input w-full px-4 py-3 rounded-lg mt-4 ${
                error ? "border-red-500" : ""
              }`}
              required
            />
            <Button type="submit" className="w-full mt-4">
              login
            </Button>
          </form>
        </div>
      </div>
      <Toaster /> {/* Sonner toastsni chiqaradi */}
    </div>
  );
};

export default Login;
