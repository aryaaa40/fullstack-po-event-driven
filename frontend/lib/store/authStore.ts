import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Role } from "@/types/auth";

interface AuthState {
  token: string | null;
  username: string | null;
  role: Role | null;
  departmentId: number | null;
  departmentName: string | null;
  _hasHydrated: boolean;
  setAuth: (token: string, username: string, role: Role, departmentId: number | null, departmentName: string | null) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      departmentId: null,
      departmentName: null,
      _hasHydrated: false,
      setAuth: (token, username, role, departmentId, departmentName) =>
        set({ token, username, role, departmentId, departmentName }),
      logout: () => set({ token: null, username: null, role: null, departmentId: null, departmentName: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
