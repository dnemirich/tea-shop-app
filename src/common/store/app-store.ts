import { create } from 'zustand';

type AppState = {
  // isLoggedIn: boolean;
  error: string | null;
  setAppError: (message: string) => void;
  clearError: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  error: null,
  setAppError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));
