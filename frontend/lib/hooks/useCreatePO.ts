"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { poRepository } from "@/lib/repositories/poRepository";
import { useAuthStore } from "@/lib/store/authStore";
import { useDraftStore } from "@/lib/store/draftStore";
import { POCategory, POPriority } from "@/types/po";

export interface ItemFormState {
  itemName: string;
  quantity: string;
  unitPrice: string;
}

export interface FormState {
  title: string;
  description: string;
  // Classification
  category: string;
  priority: string;
  // Manual amount (used only when no items)
  amount: string;
  // Procurement
  vendor: string;
  requiredDate: string;
  deliveryAddress: string;
  justification: string;
  // Financial
  currency: string;
  budgetCode: string;
  paymentTerms: string;
  notes: string;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  priority: "NORMAL",
  amount: "",
  vendor: "",
  requiredDate: "",
  deliveryAddress: "",
  justification: "",
  currency: "IDR",
  budgetCode: "",
  paymentTerms: "",
  notes: "",
};

export function useCreatePO() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  
  const { departmentId } = useAuthStore();
  const { saveDraft, getDraft, deleteDraft } = useDraftStore();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [items, setItems] = useState<ItemFormState[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from draft if navigating from Drafts page
  useEffect(() => {
    if (draftId) {
      const draft = getDraft(draftId);
      if (draft && draft.data) {
        setForm(draft.data.form || INITIAL_FORM);
        setItems(draft.data.items || []);
      }
    }
  }, [draftId, getDraft]);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function addItem() {
    setItems((prev) => [...prev, { itemName: "", quantity: "", unitPrice: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemFormState, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setError(null);
  }

  const hasItems = items.length > 0;
  const itemsTotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
  }, 0);
  const amountValue = hasItems ? itemsTotal : parseFloat(form.amount) || 0;

  function validate(): string | null {
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.category) return "Category is required.";
    if (!form.vendor.trim()) return "Vendor is required.";
    if (!form.requiredDate) return "Required date is required.";
    if (!departmentId) return "Your account has no department assigned. Please contact admin.";
    
    if (!hasItems) return "At least one item is required.";
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.itemName.trim()) return `Item ${i + 1}: name is required.`;
      const qty = parseFloat(item.quantity);
      if (!item.quantity || isNaN(qty) || qty <= 0)
        return `Item ${i + 1}: quantity must be a positive number.`;
      const price = parseFloat(item.unitPrice);
      if (!item.unitPrice || isNaN(price) || price <= 0)
        return `Item ${i + 1}: unit price must be a positive number.`;
    }
    
    return null;
  }

  function saveAsDraft() {
    saveDraft(draftId, { form, items });
    toast.success("Saved as draft!", {
      duration: 3000,
      description: "You can resume editing it from the My Drafts menu later.",
    });
    router.push("/po/drafts");
  }

  async function submit() {
    const err = validate();

    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    try {
      const po = await poRepository.create({
        title: form.title.trim(),
        description: form.description.trim(),
        departmentId: departmentId!,
        priority: form.priority as POPriority,
        ...(form.category && { category: form.category as POCategory }),
        ...(!hasItems && { amount: parseFloat(form.amount) }),
        ...(form.vendor.trim() && { vendor: form.vendor.trim() }),
        ...(form.requiredDate && { requiredDate: form.requiredDate }),
        ...(form.deliveryAddress.trim() && { deliveryAddress: form.deliveryAddress.trim() }),
        ...(form.justification.trim() && { justification: form.justification.trim() }),
        ...(form.currency.trim() && { currency: form.currency.trim() }),
        ...(form.budgetCode.trim() && { budgetCode: form.budgetCode.trim() }),
        ...(form.paymentTerms.trim() && { paymentTerms: form.paymentTerms.trim() }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(hasItems && {
          items: items.map((item) => ({
            itemName: item.itemName.trim(),
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
          })),
        }),
      });

      const now = new Date();
      toast.success("PO successfully created!", {
        description: now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: 4000,
      });

      // Cleanup local draft if submitted successfully
      if (draftId) {
        deleteDraft(draftId);
      }

      router.push(`/po/${po.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create PO.");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    setField,
    items,
    addItem,
    removeItem,
    updateItem,
    hasItems,
    amountValue,
    submit,
    saveAsDraft,
    loading,
    error,
  };
}
