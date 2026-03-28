"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, Trash2, FileEdit } from "lucide-react";
import { useDraftStore } from "@/lib/store/draftStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return iso;
  }
}

function calculateDraftAmount(data: any): number {
  if (!data?.items || !Array.isArray(data.items)) return parseFloat(data?.form?.amount) || 0;
  return data.items.reduce((acc: number, item: any) => acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
}

function formatIDR(value: number) {
  return value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
}

export default function DraftsContent() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const { drafts, deleteDraft } = useDraftStore();
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (role !== "REQUESTER") {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium" style={{ color: "#566166" }}>
          Only Requesters can manage drafts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#f3eeff" }}
            >
              <Edit3 size={18} style={{ color: "#6750A4" }} />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              My Drafts
            </h1>
          </div>
          <p className="mt-1.5 text-sm" style={{ color: "#566166" }}>
            Unfinished purchase orders saved locally on your device.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
        }}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: "rgba(217,228,234,0.5)" }}>
          <h2 className="text-base font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
            Saved Drafts ({drafts.length})
          </h2>
          <Link
            href="/po/new"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: "#0053db" }}
          >
            + Create New
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: "#f0f4f7" }}>
              <FileEdit size={28} style={{ color: "#8fa3ab" }} />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
              No Drafts Found
            </p>
            <p className="text-sm max-w-sm" style={{ color: "#566166" }}>
              You don&apos;t have any unsaved purchase orders. Start creating one and you can save it later.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className="text-xs tracking-wider uppercase"
                style={{ backgroundColor: "#f8fafc", color: "#566166" }}
              >
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Vendor</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Est. Amount</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(217,228,234,0.5)]">
                {drafts.map((draft) => {
                  const title = draft.data.form?.title || "Untitled Draft";
                  const vendor = draft.data.form?.vendor || "—";
                  const itemsCount = draft.data.items?.length || 0;
                  const estimatedAmount = calculateDraftAmount(draft.data);

                  return (
                    <tr key={draft.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-3.5 font-medium" style={{ color: "#2a3439" }}>
                        {title}
                      </td>
                      <td className="px-6 py-3.5" style={{ color: "#566166" }}>
                        {vendor}
                      </td>
                      <td className="px-6 py-3.5" style={{ color: "#566166" }}>
                        {itemsCount}
                      </td>
                      <td className="px-6 py-3.5 font-medium" style={{ color: "#2a3439" }}>
                        {formatIDR(estimatedAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: "#8fa3ab" }}>
                        {formatDate(draft.updatedAt)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => router.push(`/po/new?draftId=${draft.id}`)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-70"
                            style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
                            title="Edit Draft"
                          >
                            <Edit3 size={13} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => deleteDraft(draft.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-70"
                            style={{ backgroundColor: "#fff7f6", color: "#9f403d" }}
                          >
                            <Trash2 size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
