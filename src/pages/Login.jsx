import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (isSignup) {
        await signup(email, password, fullName).then((res) => {
          if (res.success) {
            setMessage("Account created! Logging in...");
            navigate("/home");
          } else {
            setMessage(`Error: ${res.message}`);
          }
        });
      } else {
        await login(email, password).then((res) => {
          console.log("res", res);
          if (res.success) {
            setMessage("Login successful! Redirecting...");
            navigate("/home");
          } else {
            setMessage(`Error: ${res.message}`);
          }
        });
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isSignup ? "Sign Up" : "Sign In"}
      </h2>

      <div className="space-y-4">
        {isSignup ? (
          <input
            type="Full Name"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
        ) : null}
        <input
          type="email"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Sign In"}
        </button>
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="w-full text-center text-sm text-blue-600 hover:underline mt-2"
        >
          {isSignup
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
        {message && (
          <div
            className={`text-sm p-3 rounded ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
