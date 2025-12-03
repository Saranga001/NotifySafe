import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Nav({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div>
          <Link to="/home" className="text-xl font-semibold">
            NotifySafe
          </Link>
          <p className="text-sm text-gray-500">
            Secure Notification & Alerts Demo
          </p>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/home" className="px-3 py-1 hover:bg-sky-100 rounded">
            Home
          </Link>
          <Link to="/inbox" className="px-3 py-1 hover:bg-sky-100 rounded">
            Inbox
          </Link>
          <Link to="/activity" className="px-3 py-1 hover:bg-sky-100 rounded">
            Activity
          </Link>
          <Link to="/dashboard" className="px-3 py-1 hover:bg-sky-100 rounded">
            Analytics
          </Link>
          <Link to="/templates" className="px-3 py-1 hover:bg-sky-100 rounded">
            Templates
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.displayName || user.email}
              </span>
              <button
                className="px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-sky-100 rounded">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
// <button
//   className={`px-3 py-1 ${
//     page === "home" ? "bg-sky-100 rounded" : ""
//   }`}
//   onClick={() => setPage("home")}
// >
//   Home
// </button>
// <button
//   className={`px-3 py-1 ${
//     page === "inbox" ? "bg-sky-100 rounded" : ""
//   }`}
//   onClick={() => setPage("inbox")}
// >
//   Inbox
// </button>
// <button
//   className={`px-3 py-1 ${
//     page === "activity" ? "bg-sky-100 rounded" : ""
//   }`}
//   onClick={() => setPage("activity")}
// >
//   Activity
// </button>
// <button
//   className={`px-3 py-1 ${
//     page === "dashboard" ? "bg-sky-100 rounded" : ""
//   }`}
//   onClick={() => setPage("dashboard")}
// >
//   Analytics
// </button>
// <button
//   className={`px-3 py-1 ${
//     page === "templates" ? "bg-sky-100 rounded" : ""
//   }`}
//   onClick={() => setPage("templates")}
// >
//   Templates
// </button>

// {
//   user ? (
//     <div className="flex items-center gap-2">
//       <span className="text-sm text-gray-600">{user.displayName}</span>
//       <button
//         className="px-2 py-1 bg-red-100 rounded"
//         onClick={() => {
//           auth.logout();
//           onLogout && onLogout();
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   ) : (
//     <button
//       className="px-3 py-1 bg-sky-100 rounded"
//       onClick={() => setPage("login")}
//     >
//       Login
//     </button>
//   );
// }
//     </nav>
//   </div>
//     // </header>
//   );
// }
