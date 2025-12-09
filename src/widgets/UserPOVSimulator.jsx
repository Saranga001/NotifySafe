import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { appwriteBackend } from "../api/appwrite-backend";

function UserPOVSimulator({ user, userAccount, event, refreshKey }) {
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);

  const chatContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userAccount) {
      setEmails([]);
      setMessages([]);
      return;
    } else {
      (async () => {
        await appwriteBackend
          .getInbox(userAccount?.$id, "EMAIL")
          .then((res) => setEmails(res));
        await appwriteBackend
          .getInbox(userAccount?.$id, "SMS")
          .then((res) => setMessages(res));
      })();
    }
  }, [userAccount, refreshKey]);

  useEffect(() => {
    if (messages.length && emails.length) {
      return;
    }
  }, [emails, messages]);

  return (
    <div className="border-2 rounded-md p-4 border-dashed border-gray-300 bg-gray-100 h-96 ">
      <Toaster
        position="top-right"
        containerStyle={{ position: "relative" }}
        reverseOrder={false}
      />
      <div className="w-full h-full flex items-stretch justify-center overflow-hidden">
        {user ? (
          <div className="w-full h-full grid grid-cols-5 ">
            <div className="h-full w-full col-span-2 flex flex-col min-h-0 border-r-2 border-dashed border-gray-300 ">
              <div
                ref={chatContainerRef}
                className="overflow-y-auto flex-1 flex flex-col-reverse pb-4 space-y-4 h-full rounded-md"
              >
                {messages.length > 0 &&
                  messages.map((sms) => (
                    <div
                      key={sms?.$id}
                      className="flex flex-col gap-1 w-full max-w-[320px] "
                    >
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-heading">
                          Bank SMS Service
                        </span>
                        <span className="text-sm text-body">
                          {new Date(sms?.$createdAt).toTimeString().slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex flex-col leading-1.5 p-4 bg-neutral-secondary-soft rounded-e-base rounded-es-bas bg-white shadow-sm">
                        <p className="text-sm text-body">{sms?.message}</p>
                      </div>
                      <span className="text-sm text-body">Delivered</span>
                    </div>
                  ))}
              </div>
              <p className="text-center text-gray-400">SMS will appear here</p>
            </div>
            <div className="h-full w-full col-span-3 flex flex-col min-h-0 border-l-2 border-dashed border-gray-300">
              <p className="text-center text-gray-400">
                Signed in as:{" "}
                <span className="font-mono text-sm text-center">
                  {userAccount?.email || "No Email Selected"}
                </span>
              </p>
              <div className="overflow-y-auto flex-1 p-2 space-y-4 h-full rounded-md">
                {emails.length > 0 &&
                  emails.map((em) => (
                    <div key={em?.$id}>
                      <div className="bg-gray-100 font-sans">
                        <div className="max-w-2xl mx-auto my-4 bg-white rounded-lg shadow-lg overflow-hidden">
                          <div className="px-8 pt-6 pb-3">
                            <h2 className="text-lg font-bold text-gray-800 mb-2">
                              Hi {userAccount?.email}!
                            </h2>
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {em?.message}
                            </p>
                          </div>
                          <div className="bg-gray-50 px-8 pb-6 pt-3">
                            <p className="text-gray-500 text-sm text-center">
                              You received this email because you signed up for
                              Our Bank. If you don't want to receive these
                              emails, you can{" "}
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                unsubscribe here
                              </a>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 ">Sign in to see notifications here.</p>
        )}
      </div>
    </div>
  );
}

export default UserPOVSimulator;
