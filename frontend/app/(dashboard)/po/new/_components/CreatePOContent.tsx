"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Info, Loader2, SendHorizonal, X } from "lucide-react";
import { useCreatePO } from "@/lib/hooks/useCreatePO";
import POFormSectionBasic from "./POFormSectionBasic";
import POFormSectionItems from "./POFormSectionItems";
import POFormSectionDetails from "./POFormSectionDetails";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

export default function CreatePOContent() {
  const {
    form,
    setField,
    items,
    addItem,
    removeItem,
    updateItem,
    hasItems,
    amountValue,
    submit,
    loading,
    error,
  } = useCreatePO();

  const [showModal, setShowModal] = useState(false);

  const formatted = amountValue.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  function handleConfirm() {
    setShowModal(false);
    submit();
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Back */}
        <Link
          href="/dashboard"
          className="flex w-fit items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#566166" }}
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              Create New Purchase Order
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#566166" }}>
              Fill in the details to initiate a formal procurement request.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#0053db", color: "#f8f7ff", fontFamily: FONT_MANROPE }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Submit for Approval
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="rounded-xl px-5 py-3 text-sm"
            style={{
              backgroundColor: "#fff7f6",
              color: "#9f403d",
              border: "1px solid rgba(159,64,61,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Main layout */}
        <div className="flex gap-5">
          {/* Left — form sections */}
          <div className="flex flex-1 flex-col gap-5">
            <POFormSectionBasic form={form} setField={setField} />
            <POFormSectionItems
              items={items}
              hasItems={hasItems}
              amountValue={amountValue}
              formAmount={form.amount}
              addItem={addItem}
              removeItem={removeItem}
              updateItem={updateItem}
              setAmountField={(v) => setField("amount", v)}
            />
            <POFormSectionDetails form={form} setField={setField} />
          </div>

          {/* Right — summary sidebar */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            {/* Order summary */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
            >
              <h2
                className="text-base font-bold"
                style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
              >
                Order Summary
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                {hasItems && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#566166" }}>
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "#2a3439" }}>
                      {formatted}
                    </span>
                  </div>
                )}
                <div
                  className="my-1 h-px"
                  style={{ backgroundColor: "rgba(86,97,102,0.12)" }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#2a3439" }}>
                    Total Amount
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#0053db", fontFamily: FONT_MANROPE }}
                  >
                    {formatted}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#0053db", color: "#f8f7ff", fontFamily: FONT_MANROPE }}
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Submit for Approval
              </button>
            </div>

            {/* What happens next */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
            >
              <h2
                className="text-sm font-bold"
                style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
              >
                What happens next?
              </h2>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "#566166" }}>
                After submission, your PO will be set to{" "}
                <span
                  className="rounded-full px-1.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: "#0053db", color: "#f8f7ff" }}
                >
                  PENDING
                </span>{" "}
                and routed to a{" "}
                <span className="font-semibold" style={{ color: "#2a3439" }}>
                  Manager
                </span>{" "}
                for the first approval.
              </p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div
          className="flex items-start gap-3 rounded-xl px-5 py-4"
          style={{ backgroundColor: "#f0f4f7" }}
        >
          <Info size={16} className="mt-0.5 shrink-0" style={{ color: "#0053db" }} />
          <p className="text-sm leading-relaxed" style={{ color: "#566166" }}>
            Upon submission, this PO will be routed to the{" "}
            <span className="font-semibold" style={{ color: "#2a3439" }}>Manager</span>{" "}
            for approval before being escalated to{" "}
            <span className="font-semibold" style={{ color: "#2a3439" }}>Finance</span>.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(42,52,57,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl p-8"
            style={{ backgroundColor: "#ffffff", boxShadow: "0 20px 40px rgba(42,52,57,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 transition-opacity hover:opacity-60"
            >
              <X size={18} style={{ color: "#566166" }} />
            </button>
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#f0f4f7" }}
            >
              <SendHorizonal size={22} style={{ color: "#0053db" }} />
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              Submit Purchase Order?
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#566166" }}>
              Pastikan semua detail sudah benar. PO ini akan langsung dikirim ke{" "}
              <span className="font-semibold" style={{ color: "#2a3439" }}>Manager</span>{" "}
              untuk persetujuan dan tidak dapat diedit setelah disubmit.
            </p>
            {form.title && (
              <div
                className="mt-5 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#f0f4f7" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#566166" }}
                >
                  PO Title
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#2a3439" }}>
                  {form.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs" style={{ color: "#566166" }}>Total Amount</p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "#0053db", fontFamily: FONT_MANROPE }}
                  >
                    {formatted}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#f0f4f7", color: "#566166", fontFamily: FONT_MANROPE }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0053db", color: "#f8f7ff", fontFamily: FONT_MANROPE }}
              >
                <SendHorizonal size={15} />
                Ya, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
