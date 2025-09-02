

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import SaleDetails from "../components/SaleDetails";
import AlertMessage from "../components/AlertMessage";
import ReceiptModal from "../components/ReceiptModal";
import { pageShell } from "../utils/styles";
import { renderPrintableReceipt } from "../utils/helpers";
import api from "../api/api"; // ✅ use configured axios (Django backend)

export default function SalesCounterPage({ session, onLogout }) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [pendingBill, setPendingBill] = useState(null);

  // ✅ Fetch products from backend (authorized)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/"); // token added by api.js interceptor
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setAlert({ type: "error", message: "Failed to load products" });
      }
    };
    fetchProducts();
  }, []);

  const handleSelect = (p) => {
    setSelected(p);
    if (p.stock <= 0) setAlert({ type: "error", message: "Product out of stock" });
  };

  const onBillNow = ({ product, qty, discount, totals }) => {
    const bill = {
      product_id: product.id,
      product,
      qty,
      discount,
      totals,
      staff: session.name,
      staffId: session.id,
      counter: session.counter,
      mode: "Cash",
      date: new Date().toISOString(),
    };
    setPendingBill(bill);
    setReceiptOpen(true);
  };

  const onConfirm = async () => {
    if (!pendingBill) {
      setAlert({ type: "error", message: "No bill selected" });
      return;
    }

    try {
      // Prepare payload
      const payload = {
        product_id: pendingBill.product_id,
        qty: pendingBill.qty,
        discount: pendingBill.discount,
        mode: pendingBill.mode, // e.g., "Cash"
      };

      // ✅ Save sale
      const resSale = await api.post("/sales/", payload);

      // ✅ Update product list
      const resProducts = await api.get("/products/");
      setProducts(resProducts.data);

      // Close receipt modal
      setReceiptOpen(false);

      // ✅ Print receipt
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(renderPrintableReceipt(resSale.data));
        w.document.close();
        w.focus();
        w.print();
        w.close();
      } else {
        console.warn("Popup blocked: cannot print receipt");
      }

      setAlert({ type: "success", message: "Bill saved & printed" });
      setSelected(null);
    } catch (err) {
      console.error("Error confirming bill:", err.response?.data || err.message);
      setAlert({ type: "error", message: "Failed to save bill" });
    }
  };

  return (
    <div>
      <Header user={session} onLogout={onLogout} />

      <div style={pageShell.container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ProductList products={products} onSelect={handleSelect} />
          <div>
            <SaleDetails selected={selected} onBillNow={onBillNow} />
          </div>
        </div>
      </div>

      <AlertMessage {...alert} onClose={() => setAlert(null)} />
      <ReceiptModal
        open={receiptOpen}
        bill={pendingBill}
        onClose={() => setReceiptOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}
