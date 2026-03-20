import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Role } from "@/types/auth";

interface AuthState {
  token: string | null;
  username: string | null;
  role: Role | null;
  _hasHydrated: boolean;
  setAuth: (token: string, username: string, role: Role) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      _hasHydrated: false,
      setAuth: (token, username, role) => set({ token, username, role }),
      logout: () => set({ token: null, username: null, role: null }),
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
