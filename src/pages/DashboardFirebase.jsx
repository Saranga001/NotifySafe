import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { firestoreBackend } from "../lib/appwrite-backend";

const COLORS = ["#3b82f6", "#ef4444", "#10b981"];

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState({
    channelBreakdown: [],
    deliveryRate: [],
    eventTypeBreakdown: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const allLogs = await firestoreBackend.getLogs();
    setLogs(allLogs);

    // Process logs for charts
    const deliveryAttempts = allLogs.filter(
      (l) => l.type === "DELIVERY_ATTEMPT"
    );
    const successfulDeliveries = allLogs.filter(
      (l) => l.type === "DELIVERY_SUCCESS"
    );
    const failedDeliveries = allLogs.filter(
      (l) => l.type === "DELIVERY_ALL_FAILED"
    );

    // Channel breakdown
    const channelCounts = {};
    deliveryAttempts.forEach((l) => {
      channelCounts[l.channel] = (channelCounts[l.channel] || 0) + 1;
    });
    const channelData = Object.entries(channelCounts).map(
      ([channel, count]) => ({
        name: channel,
        value: count,
      })
    );

    // Delivery rate
    const total = deliveryAttempts.length;
    const successful = successfulDeliveries.length;
    const failed = failedDeliveries.length;
    const deliveryRateData = [
      { name: "Successful", value: successful, fill: "#10b981" },
      { name: "Failed", value: failed, fill: "#ef4444" },
    ];

    // Event type breakdown
    const eventCounts = {};
    allLogs
      .filter((l) => l.type === "EVENT")
      .forEach((l) => {
        eventCounts[l.eventType] = (eventCounts[l.eventType] || 0) + 1;
      });
    const eventData = Object.entries(eventCounts).map(([eventType, count]) => ({
      name: eventType,
      count,
    }));

    setChartData({
      channelBreakdown: channelData,
      deliveryRate: deliveryRateData,
      eventTypeBreakdown: eventData,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Events</div>
          <div className="text-3xl font-bold">
            {logs.filter((l) => l.type === "EVENT").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Successful Deliveries</div>
          <div className="text-3xl font-bold text-green-600">
            {logs.filter((l) => l.type === "DELIVERY_SUCCESS").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Failed Deliveries</div>
          <div className="text-3xl font-bold text-red-600">
            {logs.filter((l) => l.type === "DELIVERY_ALL_FAILED").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Attempts</div>
          <div className="text-3xl font-bold">
            {logs.filter((l) => l.type === "DELIVERY_ATTEMPT").length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Delivery Rate Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Delivery Rate</h3>
          {chartData.deliveryRate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.deliveryRate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.deliveryRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-500">No data yet</div>
          )}
        </div>

        {/* Channel Breakdown Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Delivery by Channel</h3>
          {chartData.channelBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.channelBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-500">No data yet</div>
          )}
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Events by Type</h3>
        {chartData.eventTypeBreakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.eventTypeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-gray-500">No events logged yet</div>
        )}
      </div>
    </div>
  );
}
