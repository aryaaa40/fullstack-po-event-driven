"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { poRepository } from "@/lib/repositories/poRepository";

interface FormState {
  title: string;
  description: string;
  amount: string;
}

const INITIAL: FormState = { title: "", description: "", amount: "" };

export function useCreatePO() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) return "Amount must be a positive number.";
    return null;
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
        amount: parseFloat(form.amount),
      });

      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      toast.success("PO successfully created!", {
        description: `${dateStr}, ${timeStr}`,
        duration: 4000,
      });

      router.push(`/po/${po.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create PO.");
    } finally {
      setLoading(false);
    }
  }

  const amountValue = parseFloat(form.amount) || 0;

  return { form, setField, submit, loading, error, amountValue };
}
