import Currency from "./Currency";
import { td, th } from "../utils/styles";

export default function ReportTable({ rows }) {
  const total = rows.reduce((acc, r) => acc + (r.totals?.total || 0), 0);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Date/Time</th>
            <th style={th}>Counter</th>
            <th style={th}>Staff</th>
            <th style={th}>Product</th>
            <th style={th}>Qty</th>
            <th style={th}>Taxable</th>
            <th style={th}>GST</th>
            <th style={th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id}>
              <td style={td}>{new Date(r.date).toLocaleString()}</td>
              <td style={td}>C{r.counter}</td>
              <td style={td}>{r.staff}</td>
              <td style={td}>{r.product?.name || "N/A"}</td>
              <td style={td}>{r.qty}</td>
              <td style={td}><Currency value={r.totals?.taxable || 0} /></td>
              <td style={td}><Currency value={r.totals?.gst || 0} /></td>
              <td style={{ ...td, fontWeight: 700 }}>
                <Currency value={r.totals?.total || 0} />
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ ...td }} colSpan={7}><strong>Grand Total</strong></td>
            <td style={{ ...td, fontWeight: 700 }}><Currency value={total} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

