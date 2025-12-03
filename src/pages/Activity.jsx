import React, { useEffect, useState } from "react";
import { firestoreBackend } from "../lib/appwrite-backend";

export default function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const allLogs = await firestoreBackend.getLogs();
    setLogs(allLogs);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Activity Logs</h2>
      <div className="mt-3 bg-white rounded shadow p-4">
        {logs.length === 0 && (
          <div className="text-sm text-gray-500">No logs yet.</div>
        )}
        <ul className="space-y-2">
          {logs.map((l, idx) => (
            <li key={idx} className="text-sm border-b pb-2">
              <div className="text-xs text-gray-400">
                {l.timestamp instanceof Object
                  ? new Date(l.timestamp.seconds * 1000).toISOString()
                  : l.timestamp}{" "}
                • {l.type}
              </div>
              <div className="text-sm">{JSON.stringify(l, null, 2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// return (
//   <div>
//     <h2 className="text-lg font-semibold">Activity Logs</h2>
//     <div className="mt-3 bg-white rounded shadow p-4">
//       {logs.length === 0 && (
//         <div className="text-sm text-gray-500">No logs yet.</div>
//       )}
//       <ul className="space-y-2">
//         {logs.map((l, idx) => (
//           <li key={idx} className="text-sm border-b pb-2">
//             <div className="text-xs text-gray-400">
//               {l.timestamp} • {l.type}
//             </div>
//             <div className="text-sm">{JSON.stringify(l, null, 2)}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );
