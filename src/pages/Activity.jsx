import React, { useEffect, useState } from "react";
import { appwriteBackend } from "../api/appwrite-backend";

export default function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const allLogs = await appwriteBackend.getLogs();
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
              <div className="text-md text-gray-500">
                {l.$createdAt instanceof Object
                  ? new Date(l.$createdAt.seconds * 1000).toISOString()
                  : l.$createdAt}{" "}
                • {l.event_type}
              </div>
              {l?.accounts && (
                <div>
                  Account:
                  <pre
                    className=""
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {JSON.stringify(l?.accounts, null, 4)}
                  </pre>
                </div>
              )}
              <div className="text-sm">
                <i>Metadata:</i>
                <pre
                  className=""
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {JSON.stringify(l?.metadata, null, 4)}
                </pre>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
