import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationSimulator from "../widgets/NotificationSimulator";
import UserPOVSimulator from "../widgets/UserPOVSimulator";

export default function Home({ user }) {
  const [event, setEvent] = useState();
  const [userAccount, setUserAccount] = useState();

  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="space-y-6">
      {!user && (
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
          </div>
        </section>
      )}

      {user && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="font-medium">Simulate Events</h3>
          <NotificationSimulator
            event={event}
            setEvent={setEvent}
            userAccount={userAccount}
            setUserAccount={setUserAccount}
            triggerRefresh={triggerRefresh}
          />
        </section>
      )}

      <section className="bg-white p-6 rounded shadow">
        <h3 className="font-medium mb-2">User Point of View</h3>
        <UserPOVSimulator
          user={user}
          userAccount={userAccount}
          event={event}
          refreshKey={refreshKey}
        />
      </section>
    </div>
  );
}
