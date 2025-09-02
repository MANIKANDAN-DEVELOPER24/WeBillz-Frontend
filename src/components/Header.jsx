

import { pageShell } from "../utils/styles";
import logo from "../assets/logo.png"; 

export default function Header({ user, onLogout }) {
  return (
    <header style={pageShell.header}>
      
      {/* Left side: Logo + Title */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <img 
          src={logo} 
          alt="WeBillz Logo" 
          style={{ width: 32, height: 32, borderRadius: 6 }}
        />
        <h2 style={{ margin: 0 }}>WeBillz</h2>
      </div>

      {/* Right side: User info + Logout */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {user && (
          <>
            <span style={{ fontWeight: 600 }}>
              {user.role === "admin" ? "Admin" : `Counter ${user.counter}`}
            </span>
            <button style={pageShell.lightBtn} onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
      
    </header>
  );
}
