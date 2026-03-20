import { PurchaseOrderItem } from "@/types/po";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

function fmt(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function PODetailItemsTable({
  items,
  totalAmount,
}: {
  items: PurchaseOrderItem[];
  totalAmount: number;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#566166" }}
      >
        Line Items ({items.length})
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {["#", "Item Name", "Qty", "Unit Price", "Subtotal"].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "#566166",
                    borderBottom: "1px solid rgba(42,52,57,0.08)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid rgba(42,52,57,0.04)" }}
              >
                <td
                  className="py-3 pr-4 text-xs font-medium"
                  style={{ color: "#566166" }}
                >
                  {i + 1}
                </td>
                <td className="py-3 pr-4 text-sm" style={{ color: "#2a3439" }}>
                  {item.itemName}
                </td>
                <td className="py-3 pr-4 text-sm" style={{ color: "#566166" }}>
                  {item.quantity}
                </td>
                <td className="py-3 pr-4 text-sm" style={{ color: "#566166" }}>
                  {fmt(item.unitPrice)}
                </td>
                <td className="py-3 text-sm font-semibold" style={{ color: "#2a3439" }}>
                  {fmt(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ backgroundColor: "#f0f4f7" }}
      >
        <span className="text-sm font-semibold" style={{ color: "#566166" }}>
          Total
        </span>
        <span
          className="text-base font-bold"
          style={{ color: "#0053db", fontFamily: FONT_MANROPE }}
        >
          {fmt(totalAmount)}
        </span>
      </div>
    </div>
  );
}
