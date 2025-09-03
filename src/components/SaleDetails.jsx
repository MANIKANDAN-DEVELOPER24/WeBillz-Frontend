import { useEffect, useState } from "react";
import { pageShell } from "../utils/styles";
import Currency from "./Currency";

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
      }}
    >
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function SaleDetails({ selected, onBillNow }) {
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setQty(1);
    setDiscount(0);
  }, [selected?.id]);

  if (!selected) {
    return (
      <div
        style={{
          ...pageShell.card,
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        Select a product to bill
      </div>
    );
  }

  if (selected.stock <= 0) {
    return (
      <div style={{ ...pageShell.card }}>
        <h3 style={{ marginTop: 0 }}>Sale Details</h3>
        <div
          style={{
            padding: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: 10,
          }}
        >
          Product out of stock
        </div>
      </div>
    );
  }

  const mrp = selected.price;
  const subTotal = mrp * qty;
  const discountAmt = Math.min(discount, subTotal);
  const taxable = Math.max(0, subTotal - discountAmt);
  const gst = (taxable * (selected.gstPct || 0)) / 100;
  const total = taxable + gst;

  const isInvalid = qty < 1 || qty > selected.stock || discount > subTotal;

  return (
    <div style={{ ...pageShell.card }}>
      <h3 style={{ marginTop: 0 }}>Sale Details</h3>

      <div style={{ ...pageShell.card, background: "#f9fafb" }}>
        <div style={{ fontWeight: 700 }}>{selected.name}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          MRP: <Currency value={mrp} /> | GST: {selected.gstPct}%
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>Quantity</label>
          <input
            type="number"
            min={1}
            max={selected.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={pageShell.input}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "#6b7280" }}>
            Discount (₹)
          </label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            style={pageShell.input}
          />
        </div>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
        <Row label="Subtotal" value={<Currency value={subTotal} />} />
        <Row label="Discount" value={<Currency value={-discountAmt} />} />
        <Row
          label={`GST (${selected.gstPct}%)`}
          value={<Currency value={gst} />}
        />
        <Row
          label={<strong>Total</strong>}
          value={
            <strong>
              <Currency value={total} />
            </strong>
          }
        />
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          style={{
            ...pageShell.button,
            flex: 1,
            opacity: isInvalid ? 0.5 : 1,
            cursor: isInvalid ? "not-allowed" : "pointer",
          }}
          onClick={() =>
            onBillNow({
              product: selected,
              qty,
              discount: discountAmt,
              totals: { subTotal, gst, total, taxable },
            })
          }
          disabled={isInvalid}
        >
          Bill Now
        </button>
      </div>
    </div>
  );
}
