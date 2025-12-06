import React, { useState, useEffect } from "react";
import { appwriteBackend } from "../api/appwrite-backend";
import { useAuth } from "../hooks/useAuth";

export default function NotificationSimulator({
  event,
  setEvent = () => {},
  userAccount,
  setUserAccount = () => {},
}) {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [template, setTemplate] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      appwriteBackend
        .getEvents()
        .then((res) => {
          setEvents(res);
        })
        .catch(() => setEvents([]));

      appwriteBackend
        .getDBAccounts()
        .then((res) => {
          setAccounts(res);
        })
        .catch(() => setAccounts([]));
    } catch (error) {
      console.error("Error while fatching data: ", error);
    }
  }, [setAccounts, setEvents]);

  const getTemplate = React.useCallback(
    () => async () => {
      await appwriteBackend
        .getTemplateByName(event?.event_type)
        .then((res) => {
          setTemplate(res);
        })
        .catch(() => setTemplate(null));
    },
    [event, event?.event_type, setEvent, template, setTemplate]
  );

  const send = async () => {
    setStatus("Sending...");

    await getTemplate()();

    console.log("Template sim: ", template);

    if (template) {
      const res = await appwriteBackend.triggerEvent(event, template, {
        user: userAccount.email,
        metadata: { amount: "$10.00", code: "123456" },
      });
      setStatus(
        res.success
          ? `Delivered via ${res.channel || "fallback"}`
          : "All channels failed, saved to in-app inbox"
      );
    }
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-2">
        <select
          // value={event}
          onChange={(e) => setEvent(JSON.parse(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value="" disabled selected>
            -- Select Event --
          </option>
          {events.length > 0 ? (
            events.map((op) => (
              <option key={op.$id} value={JSON.stringify(op)}>
                {op.event_type} - ({op.category})
              </option>
            ))
          ) : (
            <option disabled>No options Available</option>
          )}
        </select>
        <select
          // value={userAccount?.email}
          onChange={(e) => setUserAccount(JSON.parse(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value="" selected disabled>
            -- Select Account --
          </option>
          {accounts.length > 0 ? (
            accounts.map((op) => (
              <option key={op.$id} value={JSON.stringify(op)}>
                {op.email}
              </option>
            ))
          ) : (
            <option disabled>No options Available</option>
          )}
        </select>

        <button
          className="px-3 py-1 bg-blue-500 rounded text-white font-bold"
          onClick={send}
        >
          Trigger
        </button>
      </div>
      {status && <div className="text-sm text-gray-600">{status}</div>}
    </div>
  );
}
