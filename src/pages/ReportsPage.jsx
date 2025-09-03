import { useState, useEffect } from "react";
import api from "../api/api";
import { pageShell } from "../utils/styles";
import { toCSV, downloadFile } from "../utils/helpers";
import ReportTable from "../components/ReportTable";

export default function ReportsPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get(`/sales/?date=${date}`); // trailing slash
        setSales(res.data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    fetchSales();
  }, [date]);

  return (
    <div style={pageShell.card}>
      <h3>Daily Sales Report</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={pageShell.input} />
        <button style={pageShell.button} onClick={() => downloadFile(`sales-${date}.csv`, toCSV(sales))}>Download CSV</button>
      </div>
      <ReportTable rows={sales} />
    </div>
  );
}
