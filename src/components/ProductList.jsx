
import { useState } from "react";
import { pageShell } from "../utils/styles";
import Currency from "./Currency";

export default function ProductList({ products, onSelect }) {
  const [q, setQ] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || String(p.hsn).includes(q)
  );

  return (
    <div style={{ ...pageShell.card, height: "70vh", overflow: "auto" }}>
      <h3 style={{ marginTop: 0 }}>Select Product</h3>

      <input
        placeholder="Enter Product Name or HSN"
        style={{ ...pageShell.input, marginBottom: 8 }}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6b7280", marginTop: 20 }}>
            No products found
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => p.stock > 0 && onSelect(p)}
              style={{
                ...pageShell.card,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: p.stock > 0 ? "pointer" : "not-allowed",
                opacity: p.stock > 0 ? 1 : 0.6,
                borderColor: "#e5e7eb",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  HSN: {p.hsn}
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700 }}>
                  <Currency value={p.price} />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: p.stock > 0 ? "#059669" : "#b91c1c",
                  }}
                >
                  Available Stock: {p.stock}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
