import { useState, useEffect } from "react";
import api from "../api/api";
import StockForm from "../components/StockForm";
import Currency from "../components/Currency";
import "../index.css";

export default function ManageStock() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", price: 0, gstPct: 0, stock: 0, hsn: "", img: "", desc: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const save = async () => {
    try {
      const payload = { ...form, price: Number(form.price), gstPct: Number(form.gstPct), stock: Number(form.stock) };
      if (!form.id) {
        const res = await api.post("/products/", payload);
        setProducts([...products, res.data]);
      } else {
        const res = await api.put(`/products/${form.id}/`, payload);
        setProducts(products.map(p => (p.id === form.id ? res.data : p)));
      }
      setForm({ id: "", name: "", price: 0, gstPct: 0, stock: 0, hsn: "", img: "", desc: "" });
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const edit = (p) => setForm(p);
  const del = async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="manage-stock">
      <div className="card">
        <StockForm
          form={form}
          setForm={setForm}
          onSave={save}
          onCancel={() =>
            setForm({ id: "", name: "", price: 0, gstPct: 0, stock: 0, hsn: "", img: "", desc: "" })
          }
        />
      </div>
      <div className="card">
        <h3>Available Stock</h3>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>HSN</th>
              <th>Price</th>
              <th>GST%</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.hsn}</td>
                <td><Currency value={p.price} /></td>
                <td>{p.gstPct}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => edit(p)}>Edit</button>
                  <button onClick={() => del(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

