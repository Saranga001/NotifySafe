import React, { useEffect, useState } from "react";
import { appwriteBackend } from "../api/appwrite-backend";
import { useAuth } from "../hooks/useAuth";

export default function Inbox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) loadInbox();
  }, [user]);

  const loadInbox = async () => {
    const inbox = await appwriteBackend.getInbox(user.id);
    setMessages(inbox);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">In-App Inbox</h2>
      <div className="mt-3 bg-white p-4 rounded shadow">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">No messages yet.</div>
        )}
        <ul className="mt-2 space-y-2">
          {messages.map((m) => (
            <li key={m.$id} className="border p-2 rounded">
              <div className="text-xs text-gray-400">
                {m.$createdAt instanceof Object
                  ? new Date(m.$createdAt.seconds * 1000).toISOString()
                  : m.$createdAt}
              </div>
              <div className="text-sm">{m.message}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
