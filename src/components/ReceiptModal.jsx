import { pageShell } from "../utils/styles";
import Currency from "./Currency";
import api from "../api/api";  
function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function ReceiptModal({ open, bill, onClose, onConfirm }) {
  if (!open) return null;

  const { product, qty, discount, totals, staff, counter, mode, date } = bill;

const handleConfirm = async () => {
  try {
    const res = await api.post("/sales/", {
      product_id: product.id,
      qty,
      discount,
      mode,
    });

    if (res.status === 201) {
      // sale saved successfully, update frontend
      onConfirm(res.data);
      onClose();
    } else {
      console.warn("Unexpected response status:", res.status, res.data);
      alert("Failed to save bill: unexpected server response");
    }
  } catch (err) {
    // handle network / server errors gracefully
    console.error("Error saving bill:", err.response?.data || err.message);
    alert(
      "Failed to save bill: " +
      (err.response?.data?.detail || err.message)
    );
  }
};



  return (
    <div style={{ position: "fixed", inset: 0, background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
      <div style={{ ...pageShell.card, width: 520, background: "#fff" }}>
        <h3 style={{ marginTop: 0, textAlign: "center" }}>Bill Receipt</h3>
        <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center" }}>
          {new Date(date).toLocaleString()} • Counter {counter}
        </div>

        <div style={{ marginTop: 12 }}>
          <Row label="Product" value={<span>{product.name}</span>} />
          <Row label="Price" value={<Currency value={product.price} />} />
          <Row label="Qty" value={qty} />
          <Row label="Discount" value={<Currency value={-discount} />} />
          <Row label="Taxable" value={<Currency value={totals.taxable} />} />
          <Row label={`GST (${product.gstPct}%)`} value={<Currency value={totals.gst} />} />
          <Row label={<strong>Total</strong>} value={<strong><Currency value={totals.total} /></strong>} />
          <Row label="Bill Mode" value={mode} />
          <Row label="Billed By" value={`${staff} (C${counter})`} />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button style={{ ...pageShell.lightBtn, flex: 1 }} onClick={onClose}>Cancel</button>
          <button style={{ ...pageShell.button, flex: 1 }} onClick={handleConfirm}>Confirm & Save</button>
        </div>
      </div>
    </div>
  );
}
