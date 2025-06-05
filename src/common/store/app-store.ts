import { create } from 'zustand';

type AppState = {
  error: string | null;
  success: string | null;
  setAppError: (message: string) => void;
  clearError: () => void;
  setSuccess: (message: string) => void;
  clearSuccess: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  error: null,
  success: null,
  setAppError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
  setSuccess: (message) => set({ success: message }),
  clearSuccess: () => set({ success: null }),
}));
