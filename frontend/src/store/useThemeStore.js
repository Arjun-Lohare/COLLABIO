import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("COLLABIO-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("COLLABIO-theme", theme);
    set({ theme });
  },
}));
