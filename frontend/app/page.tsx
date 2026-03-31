"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BellRing, Briefcase, FileText, Lock, ShieldCheck, Zap } from "lucide-react";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

const customCss = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-scroll {
    animation: scrollLeft 30s linear infinite;
    display: flex;
    width: max-content;
  }
`;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#2a3439] font-sans selection:bg-[#0053db] selection:text-white">
      <style>{customCss}</style>

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[rgba(217,228,234,0.5)] bg-white/80 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#0053db" }}
          >
            <BarChart3 size={16} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <p
              className="text-sm font-bold leading-none"
              style={{ fontFamily: FONT_MANROPE, color: "#2a3439" }}
            >
              Axon
            </p>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Precision System
            </p>
          </div>
        </div>

        <div className="hidden gap-8 text-sm font-semibold text-[#566166] md:flex">
          <a href="#features" className="hover:text-[#0053db] transition-colors">Features</a>
          <a href="#workflow" className="hover:text-[#0053db] transition-colors">Workflow</a>
          <a href="#demo-guide" className="hover:text-[#0053db] transition-colors">Testing Guide</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-[#0053db] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
            style={{ fontFamily: FONT_MANROPE }}
          >
            Access Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pt-32 pb-16 md:px-12 md:pt-48 md:pb-24">
        {/* Abstract Background Blobs */}
        <div className="absolute left-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-100/30 blur-3xl" />

        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-16">

          {/* Left: Copy & CTAs */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className="text-5xl font-extrabold tracking-tight text-[#2a3439] md:text-6xl md:leading-[1.15]"
              style={{ fontFamily: FONT_MANROPE }}
            >
              Corporate Procurement, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0053db] to-[#6750A4]">
                Redefined with Precision.
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-[#566166] md:text-xl md:leading-relaxed">
              Axon is an enterprise-grade Purchase Order System. Guaranteeing zero data loss with RabbitMQ brokering and pushing real-time WebSocket approvals directly to your screen.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Link
                href="/login"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#2a3439] px-8 text-base font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-black active:scale-95"
                style={{ fontFamily: FONT_MANROPE }}
              >
                Launch Live Demo
              </Link>
              <a
                href="#features"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#d9e4ea] bg-white px-8 text-base font-bold text-[#2a3439] shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                style={{ fontFamily: FONT_MANROPE }}
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right: Unsplash Image with Floating Animation */}
          <div className="flex-1 w-full max-w-lg md:max-w-none relative animate-float">
            {/* Decorative backing frame */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-100 to-purple-100 translate-x-4 translate-y-4 -z-10" />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
              alt="Data Infrastructure and Logistics Analytics"
              className="w-full rounded-3xl shadow-2xl border border-[rgba(255,255,255,0.4)] relative z-10"
              style={{ minHeight: "350px", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-16 text-center">
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            Engineered for Reliability
          </h2>
          <p className="mt-4 text-[#566166]">Features built to handle enterprise-level demands.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="col-span-1 rounded-3xl border border-[#d9e4ea] bg-white p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-blue-500/5 md:col-span-2">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0053db]">
              <BellRing size={24} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: FONT_MANROPE }}>
              Event-Driven WebSockets Sync
            </h3>
            <p className="text-[#566166] leading-relaxed">
              Stop reloading the page. Axon intercepts approval events via RabbitMQ and pushes them flawlessly to target client browsers worldwide in milliseconds using STOMP WebSockets.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border border-[#d9e4ea] bg-white p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-blue-500/5">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: FONT_MANROPE }}>
                Live Budget Guardrails
              </h3>
            </div>
            <p className="text-[#566166] leading-relaxed">
              Our dynamic analytic dashboard tracks departmental burn rates and physically warns managers before any over-budget purchase order drops.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="col-span-1 rounded-3xl border border-[#d9e4ea] bg-white p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-blue-500/5">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FileText size={24} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: FONT_MANROPE }}>
              Offline-First Drafts
            </h3>
            <p className="text-[#566166] leading-relaxed">
              Half-finished filling a massive corporate form? Axon leverages Zustand to persist your data locally in the browser so nothing is ever lost to accidental closures.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="col-span-1 rounded-3xl border border-[#d9e4ea] bg-white p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-blue-500/5 md:col-span-2">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Lock size={24} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: FONT_MANROPE }}>
              Bulletproof Role Architectures
            </h3>
            <p className="text-[#566166] leading-relaxed">
              Axon isolates authorization routing seamlessly. Requesters draft documents, Managers act as financial gatekeepers checking utilizing caps, and Finance executives export encrypted PDFs containing final disbursements.
            </p>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              The 3-Step Precision Workflow
            </h2>
            <p className="mt-4 text-[#566166]">Strict B2B compliance baked into the interface.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {/* Step 1 */}
            <div className="relative text-center md:text-left">
              <div className="absolute left-1/2 top-8 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-gray-100 md:block" />
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#f0f4f7] font-bold text-[#0053db] md:mx-0">
                01
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Draft & Submit Request
              </h3>
              <p className="text-sm leading-relaxed text-[#566166]">
                Requesters securely draft PO forms containing complex dynamic items, automatically locking against maximum corporate allocations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center md:text-left">
              <div className="absolute left-1/2 top-8 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-gray-100 md:block" />
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#0053db] font-bold text-white shadow-lg shadow-blue-500/20 md:mx-0">
                02
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Managerial Verification
              </h3>
              <p className="text-sm leading-relaxed text-[#566166]">
                Department Heads receive real-time pings bypassing traditional polling algorithms. They review and greenlight expenditures.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center md:text-left">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#6750A4] font-bold text-white shadow-lg shadow-purple-500/20 md:mx-0">
                03
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Financial Execution
              </h3>
              <p className="text-sm leading-relaxed text-[#566166]">
                The record passes into Finance purview where officers finalize legal validations and export the document into a strict formatting PDF array.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Guide Section */}
      <section id="demo-guide" className="relative overflow-hidden bg-[#f0f4f7] py-24">
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2
                className="text-3xl font-bold md:text-4xl"
                style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
              >
                Live Demo Playbook
              </h2>
              <p className="mt-4 text-lg text-[#566166] leading-relaxed">
                Want to see the engine in action? Follow this exact testing scenario to experience the multi-role validation, real-time WebSocket broadcasting, and strict budget utilization rules.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0053db] shadow-md transition-all hover:bg-gray-50 active:scale-95"
                style={{ fontFamily: FONT_MANROPE }}
              >
                Start Testing Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Playbook Step 1 */}
            <div className="group relative rounded-3xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 border border-transparent hover:border-blue-100">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0053db] text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                1
              </div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0053db]">
                <Briefcase size={24} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Log in as Requester
              </h3>
              <p className="text-sm text-[#566166] leading-relaxed">
                Check the Analytics Dashboard to see your department's budget capacity. Next, navigate to the creation module and draft a Purchase Order.
              </p>
              <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs text-orange-800 border border-orange-100">
                <strong>System Logic:</strong> If a department has exhausted its budget—or hasn't been allocated one for the fiscal year—Axon will permanently lock PO creation.
              </div>
            </div>

            {/* Playbook Step 2 */}
            <div className="group relative rounded-3xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 border border-transparent hover:border-blue-100">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0053db] text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                2
              </div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Zap size={24} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Simulate WebSockets
              </h3>
              <p className="text-sm text-[#566166] leading-relaxed">
                Successfully submit the PO. Then, open a second browser window and log in as the <strong>Manager</strong> for the same department.
              </p>
              <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 border border-indigo-100">
                <strong>Magic Moment:</strong> Without refreshing the Manager's page, watch the "New PO Pending" notification slide in instantly via STOMP/RabbitMQ!
              </div>
            </div>

            {/* Playbook Step 3 */}
            <div className="group relative rounded-3xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 border border-transparent hover:border-blue-100">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0053db] text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                3
              </div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Managerial Approval
              </h3>
              <p className="text-sm text-[#566166] leading-relaxed">
                As the Manager, verify the requested items and proceed to grant your approval. 
              </p>
              <div className="mt-4 rounded-xl bg-teal-50 p-3 text-xs text-teal-800 border border-teal-100">
                <strong>Data Isolation:</strong> Axon securely guarantees Managers can only access and approve Purchase Orders emerging from their exact department.
              </div>
            </div>

            {/* Playbook Step 4 */}
            <div className="group relative rounded-3xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 border border-transparent hover:border-blue-100">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0053db] text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                4
              </div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <BarChart3 size={24} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                Finance Lock & Analytics
              </h3>
              <p className="text-sm text-[#566166] leading-relaxed">
                Log in as <strong>Finance</strong>. Provide the final authorization. The system will definitively deduct the funds.
              </p>
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-100">
                <strong>Live Sync:</strong> Navigate to the Analytics tab to observe your department's interactive Spending Trend chart update dynamically.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-12 text-center">
          <h2
            className="text-4xl font-extrabold tracking-tight md:text-5xl"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            Is your company ready to scale?
          </h2>
          <p className="mt-6 text-lg text-[#566166] max-w-2xl mx-auto">
            Join forward-thinking enterprises that trust Axon to streamline their complex procurement processes and regain total financial control.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/login"
              className="group flex h-14 items-center justify-center gap-2 rounded-full bg-[#0053db] px-10 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
              style={{ fontFamily: FONT_MANROPE }}
            >
              Launch Live Demo
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(217,228,234,0.5)] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "#0053db" }}>
                  <BarChart3 size={16} color="#ffffff" strokeWidth={2.5} />
                </div>
                <p className="text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                  Axon
                </p>
              </div>
              <p className="text-sm text-[#566166] leading-relaxed">
                Precision procurement system designed for the enterprise. Ensure compliance without compromising velocity.
              </p>
            </div>

            <div className="col-span-1 border-l-0 md:border-l border-[rgba(217,228,234,0.5)] md:pl-12">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2a3439] mb-4">Product</h4>
              <ul className="flex flex-col gap-3 text-sm text-[#566166]">
                <li><a href="#features" className="hover:text-[#0053db] transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-[#0053db] transition-colors">Workflow</a></li>
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div className="col-span-1 border-l-0 md:border-l border-[rgba(217,228,234,0.5)] md:pl-12">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2a3439] mb-4">Company</h4>
              <ul className="flex flex-col gap-3 text-sm text-[#566166]">
                <li><a href="#" className="hover:text-[#0053db] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="col-span-1 border-l-0 md:border-l border-[rgba(217,228,234,0.5)] md:pl-12">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2a3439] mb-4">Legal</h4>
              <ul className="flex flex-col gap-3 text-sm text-[#566166]">
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#0053db] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[rgba(217,228,234,0.5)] text-center text-sm text-[#8fa3ab]">
            © {new Date().getFullYear()} Axon Precision Systems, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
