import { BarChart3, ShieldCheck } from "lucide-react";

export default function LoginLeftPanel() {
  return (
    <div
      className="relative hidden w-[60%] flex-col overflow-hidden lg:flex"
      style={{ backgroundColor: "#1a1c1e" }}
    >
      {/* Background image overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-12 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#1d4ed8" }}
          >
            <BarChart3 size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span
            className="text-base font-semibold tracking-wide"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
            }}
          >
            Axon
          </span>
        </div>

        {/* Headline */}
        <div className="mb-auto mt-auto flex flex-col gap-5 pt-24">
          <h1
            className="text-5xl font-extrabold leading-tight tracking-tight"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
              maxWidth: "520px",
            }}
          >
            Streamlining{" "}
            <span style={{ color: "#1d4ed8" }}>Enterprise</span>
            <br />
            Procurement.
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "#9ca3af", maxWidth: "420px" }}
          >
            Manage requisitions, approvals, and financial reconciliation within
            a singular architectural workspace designed for clarity and speed.
          </p>
        </div>

        {/* Decorative cards */}
        <div className="flex gap-4 pb-4">
          <div
            className="flex flex-col gap-2 rounded-xl px-5 py-4"
            style={{ backgroundColor: "#ffffff", minWidth: "160px" }}
          >
            <BarChart3 size={20} style={{ color: "#1d4ed8" }} />
            <span
              className="text-3xl font-bold"
              style={{
                color: "#1a1c1e",
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
              }}
            >
              142
            </span>
            <span
              className="text-xs font-semibold tracking-widest"
              style={{ color: "#566166" }}
            >
              ACTIVE ORDERS
            </span>
          </div>

          <div
            className="flex flex-col justify-between rounded-xl px-5 py-4"
            style={{ backgroundColor: "#1d4ed8", minWidth: "160px" }}
          >
            <ShieldCheck size={22} color="#ffffff" />
            <div>
              <p
                className="text-2xl font-bold"
                style={{
                  color: "#ffffff",
                  fontFamily: "var(--font-manrope), Manrope, sans-serif",
                }}
              >
                Secure
              </p>
              <p
                className="text-xs font-semibold tracking-widest"
                style={{ color: "#93c5fd" }}
              >
                ENCRYPTED FLOW
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
