import React, { useEffect, useState } from "react";
import { firestoreBackend } from "../lib/appwrite-backend";
import { useAuth } from "../hooks/useAuth";

export default function Inbox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) loadInbox();
  }, [user]);

  const loadInbox = async () => {
    const inbox = await firestoreBackend.getInbox(user.id);
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
            <li key={m.id} className="border p-2 rounded">
              <div className="text-xs text-gray-400">
                {m.createdAt instanceof Object
                  ? new Date(m.createdAt.seconds * 1000).toISOString()
                  : m.createdAt}
              </div>
              <div className="text-sm">{m.message}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

//   return (
//     <div>
//       <h2 className="text-lg font-semibold">In-App Inbox</h2>
//       <div className="mt-3 bg-white p-4 rounded shadow">
//         {Object.keys(inbox).length === 0 && (
//           <div className="text-sm text-gray-500">No messages yet.</div>
//         )}
//         {Object.entries(inbox).map(([uid, msgs]) => (
//           <div key={uid} className="mb-4">
//             <div className="text-sm font-medium">User: {uid}</div>
//             <ul className="mt-2 space-y-2">
//               {msgs.map((m) => (
//                 <li key={m.id} className="border p-2 rounded">
//                   <div className="text-xs text-gray-400">{m.createdAt}</div>
//                   <div className="text-sm">{m.message}</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
