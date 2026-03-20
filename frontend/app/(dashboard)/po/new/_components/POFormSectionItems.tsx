"use client";

import { Plus, Trash2 } from "lucide-react";
import { ItemFormState } from "@/lib/hooks/useCreatePO";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

interface Props {
  items: ItemFormState[];
  hasItems: boolean;
  amountValue: number;
  formAmount: string;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof ItemFormState, value: string) => void;
  setAmountField: (value: string) => void;
}

const inputBase: React.CSSProperties = {
  backgroundColor: "#f0f4f7",
  color: "#2a3439",
  border: "1px solid transparent",
};

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.backgroundColor = "#ffffff";
  e.currentTarget.style.border = "1px solid rgba(0,83,219,0.2)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.backgroundColor = "#f0f4f7";
  e.currentTarget.style.border = "1px solid transparent";
}

function fmt(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function POFormSectionItems({
  items,
  hasItems,
  amountValue,
  formAmount,
  addItem,
  removeItem,
  updateItem,
  setAmountField,
}: Props) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0053db" }}>
          Line Items
        </p>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#eef4ff", color: "#0053db" }}
        >
          <Plus size={12} strokeWidth={3} />
          Add Item
        </button>
      </div>

      {hasItems ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["#", "Item Name", "Qty", "Unit Price (Rp)", "Subtotal", ""].map((h) => (
                  <th
                    key={h}
                    className="pb-2 text-left text-xs font-semibold tracking-wider"
                    style={{ color: "#566166", borderBottom: "1px solid rgba(42,52,57,0.08)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const subtotal =
                  (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                return (
                  <tr key={i}>
                    <td
                      className="py-2 pr-3 text-sm font-medium"
                      style={{ color: "#566166", width: "2rem" }}
                    >
                      {i + 1}
                    </td>
                    <td className="py-2 pr-2" style={{ minWidth: "180px" }}>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => updateItem(i, "itemName", e.target.value)}
                        placeholder="Item name"
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                        style={inputBase}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </td>
                    <td className="py-2 pr-2" style={{ width: "80px" }}>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(i, "quantity", e.target.value)}
                        placeholder="0"
                        min="1"
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                        style={inputBase}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </td>
                    <td className="py-2 pr-2" style={{ width: "150px" }}>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                        style={inputBase}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </td>
                    <td
                      className="py-2 pr-2 text-sm font-semibold"
                      style={{ color: "#2a3439", whiteSpace: "nowrap" }}
                    >
                      {fmt(subtotal)}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[#fff7f6]"
                        style={{ color: "#9f403d" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total row */}
          <div
            className="mt-3 flex items-center justify-between rounded-xl px-4 py-3"
            style={{ backgroundColor: "#f0f4f7" }}
          >
            <span className="text-sm font-semibold" style={{ color: "#566166" }}>
              Total
            </span>
            <span
              className="text-base font-bold"
              style={{ color: "#0053db", fontFamily: FONT_MANROPE }}
            >
              {fmt(amountValue)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#566166" }}
          >
            Total Amount (IDR) <span style={{ color: "#9f403d" }}>*</span>
          </label>
          <p className="mb-1 text-xs" style={{ color: "#566166" }}>
            No items added — enter the total amount manually, or click{" "}
            <span className="font-semibold" style={{ color: "#0053db" }}>
              Add Item
            </span>{" "}
            above to use line items instead.
          </p>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
              style={{ color: "#566166" }}
            >
              Rp
            </span>
            <input
              type="number"
              value={formAmount}
              onChange={(e) => setAmountField(e.target.value)}
              placeholder="0"
              min="0"
              step="1000"
              className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
              style={inputBase}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        </div>
      )}
    </div>
  );
}
