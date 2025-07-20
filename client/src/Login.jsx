import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userName, setUsername] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!userName) return;
    navigate(`/chat/${userName.trim()}`);
    console.log(`🔻login`);
    setUsername("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition-colors duration-300 hover:bg-blue-700 hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
