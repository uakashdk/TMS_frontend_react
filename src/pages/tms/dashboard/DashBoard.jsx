import React from "react";
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

import {
  Users, IndianRupee, Truck,
  FileText, Route, AlertCircle
} from "lucide-react";

// ─── DATA ─────────────────────────

const KPI = [
  { icon: Users, label: "Parties", val: "34" },
  { icon: Users, label: "Users", val: "12" },
  { icon: IndianRupee, label: "Revenue", val: "₹4.2L" },
  { icon: FileText, label: "Billed Trips", val: "208" },
  { icon: AlertCircle, label: "Unbilled", val: "32" },
  { icon: Truck, label: "Running", val: "48" },
  { icon: Route, label: "LR Pending", val: "11" },
];

const DATA = [
  { day: "Mon", trips: 30, revenue: 20 },
  { day: "Tue", trips: 45, revenue: 32 },
  { day: "Wed", trips: 50, revenue: 38 },
  { day: "Thu", trips: 40, revenue: 28 },
  { day: "Fri", trips: 48, revenue: 36 },
  { day: "Sat", trips: 28, revenue: 18 },
  { day: "Sun", trips: 20, revenue: 12 },
];

// ─── UI COMPONENTS ─────────────────

const CompanyCard = () => (
  <div className="rounded-3xl p-6 mb-6
    bg-gradient-to-br from-fleet-primary to-fleet-primary-dark
    text-white shadow-md">

    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Sharma Logistics Pvt Ltd
        </h2>
        <p className="text-sm opacity-80 mt-1">
          Delhi, India • GST: 07ABCDE1234F1Z5
        </p>
      </div>

      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
        Active
      </span>
    </div>

    <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
      <div>
        <p className="opacity-70">Revenue</p>
        <p className="text-xl font-semibold">₹4.2L</p>
      </div>
      <div>
        <p className="opacity-70">Trips</p>
        <p className="text-xl font-semibold">317</p>
      </div>
      <div>
        <p className="opacity-70">Growth</p>
        <p className="text-xl font-semibold text-fleet-success-light">
          +8.4%
        </p>
      </div>
    </div>
  </div>
);

const KpiCard = ({ icon: Icon, label, val }) => (
  <div className="bg-fleet-card border border-fleet-border
    rounded-2xl p-4
    hover:shadow-md hover:-translate-y-[2px]
    transition-all duration-200">

    <div className="flex items-center justify-between mb-3">
      <div className="p-2 rounded-xl bg-fleet-primary/10 text-fleet-primary">
        <Icon size={16} />
      </div>
    </div>

    <div className="text-lg font-semibold text-fleet-text-primary">
      {val}
    </div>

    <div className="text-xs text-fleet-text-muted mt-1">
      {label}
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-fleet-card border border-fleet-border
    rounded-2xl p-5">

    <h3 className="text-sm font-semibold text-fleet-text-primary mb-4">
      {title}
    </h3>

    {children}
  </div>
);

// ─── MAIN ─────────────────────────

const Dashboard = () => {
  return (
    <div className="p-6 bg-fleet-bg min-h-screen">

      {/* COMPANY */}
      <CompanyCard />

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
        {KPI.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* AREA */}
        <ChartCard title="Trips Overview">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-fleet-primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--color-fleet-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#9E9E9E" />
              <YAxis stroke="#9E9E9E" />
              <Tooltip />
              <Area
                dataKey="trips"
                stroke="var(--color-fleet-primary)"
                strokeWidth={2.5}
                fill="url(#blue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE */}
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DATA}>
              <XAxis dataKey="day" stroke="#9E9E9E" />
              <YAxis stroke="#9E9E9E" />
              <Tooltip />
              <Line
                dataKey="revenue"
                stroke="var(--color-fleet-accent)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR */}
        <ChartCard title="Trips vs Revenue">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DATA}>
              <XAxis dataKey="day" stroke="#9E9E9E" />
              <YAxis stroke="#9E9E9E" />
              <Tooltip />
              <Bar dataKey="trips" fill="var(--color-fleet-primary)" radius={[6,6,0,0]} />
              <Bar dataKey="revenue" fill="var(--color-fleet-accent)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PERFORMANCE */}
        <ChartCard title="Performance Index">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DATA}>
              <XAxis dataKey="day" stroke="#9E9E9E" />
              <YAxis stroke="#9E9E9E" />
              <Tooltip />
              <Area
                dataKey="revenue"
                stroke="var(--color-fleet-success)"
                fill="var(--color-fleet-success-light)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

export default Dashboard;