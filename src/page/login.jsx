import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

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

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError("Login Error: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center mb-6">
            <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="Logo"
            />
          </div>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
            Login
          </h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 mt-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 mt-4"
              required
            />
            <button
              type="submit"
              className="w-full mt-5 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </form>
          <div className="my-12 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Or sign up with
            </div>
          </div>
          <div className="flex flex-col items-center">
            {/* Google Sign Up Button */}
            <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-2">
              <span>Sign Up with Google</span>
            </button>
            {/* GitHub Sign Up Button */}
            <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-2">
              <span>Sign Up with GitHub</span>
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-600 text-center">
            I agree to abide by the{" "}
            <a href="#" className="border-b border-gray-500 border-dotted">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="border-b border-gray-500 border-dotted">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
