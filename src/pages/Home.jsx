import React from "react";
import { Link } from "react-router-dom";
import NotificationSimulator from "../widgets/NotificationSimulator";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold">Welcome to NotifySafe</h2>
        <p className="text-sm text-gray-600">
          A demo showing secure, event-driven notifications with multi-channel
          delivery and fallback.
        </p>
        <div className="mt-4">
          <Link to="/login" className="px-3 py-1 bg-sky-100 rounded">
            Sign In
          </Link>
          <Link to="/templates" className="px-3 py-1 ml-2 bg-gray-100 rounded">
            View Templates
          </Link>
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h3 className="font-medium">Simulate Events</h3>
        <NotificationSimulator />
      </section>
    </div>
  );
}

//       <section className="bg-white p-6 rounded shadow">
//         <h3 className="font-medium">Simulate Events</h3>
//         <NotificationSimulator />
//       </section>
//     </div>
//   );
// }
