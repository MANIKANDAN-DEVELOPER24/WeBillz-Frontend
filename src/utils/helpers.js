export function toCSV(rows) {
  const header = [
    "date",
    "counter",
    "staff",
    "product",
    "qty",
    "price",
    "discount",
    "taxable",
    "gst",
    "total"
  ];

  const all = [header.join(",")];

  // Initialize grand totals
  let grandQty = 0;
  let grandDiscount = 0;
  let grandTaxable = 0;
  let grandGST = 0;
  let grandTotal = 0;

  rows.forEach(r => {
    const qty = Number(r.qty);
    const discount = Number(r.discount);
    const taxable = Number(r.totals?.taxable ?? r.taxable);
    const gst = Number(r.totals?.gst ?? r.gst);
    const total = Number(r.totals?.total ?? r.total);

    grandQty += qty;
    grandDiscount += discount;
    grandTaxable += taxable;
    grandGST += gst;
    grandTotal += total;

    all.push([
      `"${new Date(r.date).toISOString()}"`,
      r.counter,
      `"${r.staff}"`,
      `"${r.product.name}"`,
      qty,
      Number(r.product.price).toFixed(2),
      discount.toFixed(2),
      taxable.toFixed(2),
      gst.toFixed(2),
      total.toFixed(2),
    ].join(","));
  });

  // Append grand total row
  all.push([
    "",
    "",
    "",
    `"Grand Total"`,
    grandQty,
    "",
    grandDiscount.toFixed(2),
    grandTaxable.toFixed(2),
    grandGST.toFixed(2),
    grandTotal.toFixed(2),
  ].join(","));

  return all.join("\n");
}



export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function renderPrintableReceipt(bill) {
  const css = `
    body { font-family: Arial, sans-serif; margin: 24px; }
    .row { display:flex; justify-content: space-between; margin: 6px 0; }
    .muted { color:#6b7280; font-size: 12px; }
  `;

  const price = Number(bill.product.price || 0);
  const discount = Number(bill.discount || 0);
  const taxable = Number(bill.totals.taxable || 0);
  const gst = Number(bill.totals.gst || 0);
  const total = Number(bill.totals.total || 0);
  const gstPct = Number(bill.product.gstPct || 0);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Receipt ${bill._id || ""}</title>
<style>${css}</style>
</head>
<body>
  <h2 style="margin:0;">Juice Shop</h2>
  <div class="muted">${new Date(bill.date).toLocaleString()} • Counter ${bill.counter || ""}</div>
  <hr />
  <div class="row"><div>Product</div><div>${bill.product.name}</div></div>
  <div class="row"><div>Price</div><div>₹${price.toFixed(2)}</div></div>
  <div class="row"><div>Qty</div><div>${bill.qty || 0}</div></div>
  <div class="row"><div>Discount</div><div>-₹${discount.toFixed(2)}</div></div>
  <div class="row"><div>Taxable</div><div>₹${taxable.toFixed(2)}</div></div>
  <div class="row"><div>GST (${gstPct}%)</div><div>₹${gst.toFixed(2)}</div></div>
  <div class="row" style="font-weight:700"><div>Total</div><div>₹${total.toFixed(2)}</div></div>
  <hr />
  <div class="muted">Bill Mode: ${bill.mode} • Billed By: ${bill.staff} (C${bill.counter})</div>
</body>
</html>`;
}

