import { pageShell } from "../utils/styles";

export default function StockForm({ form, setForm, onSave, onCancel }) {
  // safe update for number fields
  const handleNumberChange = (field, value) => {
    setForm({ ...form, [field]: value === "" ? "" : Number(value) });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>
        {form.id ? "Update Product" : "Add Product"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Name */}
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>Product Name</label>
          <input
            placeholder="Name"
            style={pageShell.input}
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* HSN */}
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>HSN Code</label>
          <input
            placeholder="HSN"
            style={pageShell.input}
            value={form.hsn || ""}
            onChange={(e) => setForm({ ...form, hsn: e.target.value })}
          />
        </div>

        {/* Price */}
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>Price (₹)</label>
          <input
            type="number"
            placeholder="Price"
            style={pageShell.input}
            value={form.price ?? ""}
            onChange={(e) => handleNumberChange("price", e.target.value)}
          />
        </div>

        {/* GST */}
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>GST %</label>
          <input
            type="number"
            placeholder="GST %"
            style={pageShell.input}
            value={form.gstPct ?? ""}
            onChange={(e) => handleNumberChange("gstPct", e.target.value)}
          />
        </div>

        {/* Stock */}
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>Stock Qty</label>
          <input
            type="number"
            placeholder="Stock"
            style={pageShell.input}
            value={form.stock ?? ""}
            onChange={(e) => handleNumberChange("stock", e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button style={pageShell.button} onClick={onSave}>
          {form.id ? "Update" : "Add"}
        </button>

        {form.id && (
          <button style={pageShell.lightBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
