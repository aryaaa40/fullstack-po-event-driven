import { PurchaseOrder } from "@/types/po";
import {
  Building2,
  Calendar,
  MapPin,
  FileText,
  Banknote,
  Hash,
  Clock,
  StickyNote,
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon size={12} style={{ color: "#566166" }} />
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#566166" }}
        >
          {label}
        </p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#2a3439" }}>
        {value}
      </p>
    </div>
  );
}

export default function PODetailExtras({ po }: { po: PurchaseOrder }) {
  const hasProcurement =
    po.vendor || po.requiredDate || po.deliveryAddress || po.justification;
  const hasFinancial =
    po.currency || po.budgetCode || po.paymentTerms || po.notes;

  if (!hasProcurement && !hasFinancial) return null;

  return (
    <div
      className="flex flex-col gap-6 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      {/* Procurement Details */}
      {hasProcurement && (
        <div className="flex flex-col gap-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#566166" }}
          >
            Procurement Details
          </p>

          <div className="grid grid-cols-2 gap-4">
            {po.vendor && (
              <InfoItem icon={Building2} label="Vendor" value={po.vendor} />
            )}
            {po.requiredDate && (
              <InfoItem
                icon={Calendar}
                label="Required Date"
                value={formatDate(po.requiredDate)}
              />
            )}
          </div>

          {po.deliveryAddress && (
            <InfoItem
              icon={MapPin}
              label="Delivery Address"
              value={po.deliveryAddress}
            />
          )}
          {po.justification && (
            <InfoItem
              icon={FileText}
              label="Justification"
              value={po.justification}
            />
          )}
        </div>
      )}

      {/* Divider */}
      {hasProcurement && hasFinancial && (
        <div
          className="h-px"
          style={{ backgroundColor: "rgba(42,52,57,0.08)" }}
        />
      )}

      {/* Financial Details */}
      {hasFinancial && (
        <div className="flex flex-col gap-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#566166" }}
          >
            Financial Details
          </p>

          <div className="grid grid-cols-3 gap-4">
            {po.currency && (
              <InfoItem icon={Banknote} label="Currency" value={po.currency} />
            )}
            {po.budgetCode && (
              <InfoItem icon={Hash} label="Budget Code" value={po.budgetCode} />
            )}
            {po.paymentTerms && (
              <InfoItem
                icon={Clock}
                label="Payment Terms"
                value={po.paymentTerms}
              />
            )}
          </div>

          {po.notes && (
            <InfoItem icon={StickyNote} label="Notes" value={po.notes} />
          )}
        </div>
      )}
    </div>
  );
}
