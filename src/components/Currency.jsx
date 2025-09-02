export default function Currency({ value }) {

  const n = Number(value || 0);

  return <span>₹{n.toFixed(2)}</span>;
  
}
