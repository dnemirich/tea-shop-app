import { create } from 'zustand';

type AppState = {
  // isLoggedIn: boolean;
  error: string | null;
  setError: (message: string) => void;
  clearError: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  error: null,
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));
