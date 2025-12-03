import React, { useState } from "react";
import { firestoreBackend } from "../lib/appwrite-backend";
import { useAuth } from "../hooks/useAuth";

export default function NotificationSimulator() {
  const { user } = useAuth();
  const [eventType, setEventType] = useState("LOGIN_SUCCESS");
  const [userId, setUserId] = useState(user?.id || "guest");
  const [status, setStatus] = useState("");

  const send = async () => {
    setStatus("Sending...");
    const res = await firestoreBackend.triggerEvent(eventType, {
      userId,
      metadata: { amount: "$10.00", code: "123456" },
    });
    setStatus(
      res.success
        ? `Delivered via ${res.channel || "fallback"}`
        : "All channels failed, saved to in-app inbox"
    );
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-2">
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option>LOGIN_SUCCESS</option>
          <option>ACCOUNT_DEBITED</option>
          <option>PASSWORD_CHANGED</option>
          <option>OTP_SENT</option>
        </select>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button className="px-3 py-1 bg-sky-100 rounded" onClick={send}>
          Trigger
        </button>
      </div>
      {status && <div className="text-sm text-gray-600">{status}</div>}
    </div>
  );
}
