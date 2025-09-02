

import { useState } from "react";
import Header from "../components/Header";
import { pageShell } from "../utils/styles";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await onLogin(username, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
    }
  };

  return (
    <div>
      <Header />

      <div style={{ ...pageShell.container, maxWidth: 420 }}>
        <div style={{ ...pageShell.card }}>
          <h3 style={{ marginTop: 0 }}>Login</h3>

          <form onSubmit={submit}>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                placeholder="Username"
                style={pageShell.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                style={pageShell.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!!error && (
                <div style={{ color: "#b91c1c", fontSize: 13 }}>{error}</div>
              )}
              <button type="submit" style={pageShell.button} disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 12 }}>
            Demo users: <b>admin/admin123</b> • <b>c1/c1</b> • <b>c2/c2</b> •{" "}
            <b>c3/c3</b> …
          </div>
        </div>
      </div>
    </div>
  );
}
