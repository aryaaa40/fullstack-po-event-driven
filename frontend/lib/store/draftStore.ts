import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormState, ItemFormState } from "@/lib/hooks/useCreatePO";

export interface DraftData {
  form: FormState;
  items: ItemFormState[];
}

export interface DraftPO {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: DraftData;
}

interface DraftState {
  drafts: DraftPO[];
  saveDraft: (id: string | null, data: DraftData) => string;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => DraftPO | undefined;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: [],
      
      saveDraft: (id, data) => {
        const now = new Date().toISOString();
        let draftId = id;

        if (!draftId) {
          draftId = `draft_${Date.now()}`;
          const newDraft: DraftPO = { id: draftId, createdAt: now, updatedAt: now, data };
          set((state) => ({ drafts: [newDraft, ...state.drafts] }));
        } else {
          set((state) => ({
            drafts: state.drafts.map((d) =>
              d.id === draftId ? { ...d, updatedAt: now, data } : d
            ),
          }));
        }

        return draftId;
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
        }));
      },

      getDraft: (id) => {
        return get().drafts.find((d) => d.id === id);
      },
    }),
    {
      name: "axon_po_drafts", // unique name for localStorage key
    }
  )
);
