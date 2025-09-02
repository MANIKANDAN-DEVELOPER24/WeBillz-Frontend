
import { useState } from "react";
import Header from "../components/Header";
import { pageShell } from "../utils/styles";
import StaffRegister from "./StaffRegister";
import ManageStock from "./ManageStock";
import ReportsPage from "./ReportsPage";

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...pageShell.lightBtn,
        padding: "10px 14px",
        border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
        background: active ? "#eff6ff" : "#f9fafb",
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}

export default function AdminDashboard({ session, onLogout }) {
  const [tab, setTab] = useState("staff");

  return (
    <div>
      {/* Header with logout */}
      <Header user={session} onLogout={onLogout} />

      <div style={pageShell.container}>
        {/* Tabs */}
        <div style={{ ...pageShell.card, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Tab label="Register Staff" active={tab === "staff"} onClick={() => setTab("staff")} />
            <Tab label="Manage Stock" active={tab === "stock"} onClick={() => setTab("stock")} />
            <Tab label="Download Reports" active={tab === "reports"} onClick={() => setTab("reports")} />
          </div>
        </div>

        {/* Conditional tab content */}
        {tab === "staff" && <StaffRegister />}
        {tab === "stock" && <ManageStock />}
        {tab === "reports" && <ReportsPage />}
      </div>
    </div>
  );
}
