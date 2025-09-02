import { useEffect, useState } from "react";
import api from "../api/api"; // Axios client with baseURL = "/api"
import { pageShell } from "../utils/styles";

export default function StaffRegister() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [counter, setCounter] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Add a new staff member
  const addStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const newStaff = {
        name,
        username,
        password,
        counter: Number(counter),
        role: "staff",
      };
      const res = await api.post("/auth/register/", newStaff, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      // Append the newly created staff to the list
      setUsers((prev) => [...prev, res.data]);

      // Reset form
      setName("");
      setCounter(1);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Error creating staff:", err);
      setError("Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageShell.card}>
      <h3>Create Sales Counter Person</h3>

      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          placeholder="Name"
          style={pageShell.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          placeholder="Counter No"
          style={pageShell.input}
          value={counter}
          onChange={(e) => setCounter(e.target.value)}
        />
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
      </div>
      <button style={pageShell.button} onClick={addStaff} disabled={loading}>
        {loading ? "Processing..." : "Create Staff"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Staff List */}
      <h4>Existing Staff</h4>
      {users.length > 0 ? (
        <ul>
          {users.map((u) => (
            <li key={u.username}>
              Counter {u.counter} — {u.username} ({u.name})
            </li>
          ))}
        </ul>
      ) : (
        <p>No staff found</p>
      )}
    </div>
  );
}
