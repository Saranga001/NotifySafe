import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationSimulator from "../widgets/NotificationSimulator";
import { Toaster } from "react-hot-toast";

export default function Home({ user }) {
  const [event, setEvent] = useState();
  const [userAccount, setUserAccount] = useState();

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
          />
        </section>
      )}

      <section className="bg-white p-6 rounded shadow">
        <h3 className="font-medium mb-2">User Point of View</h3>
        <div className="border-2 rounded-md p-4 border-dashed border-gray-300 bg-gray-50 h-96 ">
          <Toaster
            position="top-right"
            containerStyle={{ position: "relative" }}
            reverseOrder={false}
          />
          <div className="w-full h-full flex items-center justify-center">
            {user ? (
              <div className="w-full h-full grid grid-cols-5 text-gray-400">
                <div className="h-full w-full relative col-span-2 pr-4 overflow-y-scroll border-r-2 border-dashed border-gray-300">
                  <p className="text-center">SMS will appear here</p>

                  <div className="flex items-start gap-2.5 bg-yellow-100">
                    <div className="flex flex-col w-full max-w-[300px] leading-1.5 p-4 bg-neutral-secondary-soft rounded-e-base rounded-es-base">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-heading">
                          Bank SMS Service {event && `- ${event?.event_type}`}
                        </span>
                        <span className="text-sm text-body">11:46</span>
                      </div>
                      <p className="text-sm py-2.5 text-body">
                        That's awesome. I think our users will really appreciate
                        the improvements.
                      </p>
                      <span className="text-sm text-body">Delivered</span>
                    </div>
                  </div>
                </div>
                <div className="h-full w-full relative col-span-3 pl-4 overflow-y-scroll border-l-2 border-dashed border-gray-300">
                  <p className="text-center">You are signed in as:</p>
                  <p className="font-mono text-sm text-center">
                    {userAccount?.email || "No Email Selected"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 ">
                Sign in to see notifications here.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
