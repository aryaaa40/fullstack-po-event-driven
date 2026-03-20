"use client";

interface Props {
  form: {
    vendor: string;
    requiredDate: string;
    deliveryAddress: string;
    justification: string;
    currency: string;
    budgetCode: string;
    paymentTerms: string;
    notes: string;
  };
  setField: (field: string, value: string) => void;
}

const inputBase: React.CSSProperties = {
  backgroundColor: "#f0f4f7",
  color: "#2a3439",
  border: "1px solid transparent",
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.backgroundColor = "#ffffff";
  e.currentTarget.style.border = "1px solid rgba(0,83,219,0.2)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.backgroundColor = "#f0f4f7";
  e.currentTarget.style.border = "1px solid transparent";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "#566166" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function POFormSectionDetails({ form, setField }: Props) {
  return (
    <div
      className="flex flex-col gap-5 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      {/* Procurement section */}
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0053db" }}>
        Procurement Details
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Vendor">
          <input
            type="text"
            value={form.vendor}
            onChange={(e) => setField("vendor", e.target.value)}
            placeholder="e.g. PT Teknologi Maju"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Field>

        <Field label="Required Date">
          <input
            type="date"
            value={form.requiredDate}
            onChange={(e) => setField("requiredDate", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Field>
      </div>

      <Field label="Delivery Address">
        <textarea
          value={form.deliveryAddress}
          onChange={(e) => setField("deliveryAddress", e.target.value)}
          placeholder="Full delivery address..."
          rows={2}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={inputBase}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>

      <Field label="Justification">
        <textarea
          value={form.justification}
          onChange={(e) => setField("justification", e.target.value)}
          placeholder="Why is this purchase necessary?"
          rows={2}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={inputBase}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>

      {/* Financial section */}
      <p
        className="mt-1 text-xs font-bold uppercase tracking-widest"
        style={{ color: "#0053db" }}
      >
        Financial Details
      </p>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Currency">
          <input
            type="text"
            value={form.currency}
            onChange={(e) => setField("currency", e.target.value)}
            placeholder="IDR"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Field>

        <Field label="Budget Code">
          <input
            type="text"
            value={form.budgetCode}
            onChange={(e) => setField("budgetCode", e.target.value)}
            placeholder="e.g. BDG-2025-001"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Field>

        <Field label="Payment Terms">
          <input
            type="text"
            value={form.paymentTerms}
            onChange={(e) => setField("paymentTerms", e.target.value)}
            placeholder="e.g. NET 30"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Any additional notes or instructions..."
          rows={2}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={inputBase}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>
    </div>
  );
}
