import { create } from "zustand";
import { fetchUserData } from "../api/auth";

interface AuthState {
  token: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAgent: boolean;
  } | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAgent: boolean;
  }) => void;
  clearAuth: () => void;
  initializeUser: () => Promise<void>;
  logout: () => void;
}

const loadTokenFromStorage = () => localStorage.getItem("authToken");

export const userAuthStore = create<AuthState>((set) => ({
  token: loadTokenFromStorage(),
  user: null,
  setToken: (token) => {
    localStorage.setItem("authToken", token || "");
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem("authToken");
    set({ token: null });
  },
  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
      isUserLoaded: true,
    })),
  clearAuth: () => {
    userAuthStore.getState().logout();
  },
  initializeUser: async () => {
    const token = loadTokenFromStorage();
    if (!token) return;

    try {
      const userData = await fetchUserData(token);
      set({ user: userData });
      console.log("User data rehydrated", userData);
    } catch (error) {
      console.log("Error rehydrating user data", error);
      set({ token: null, user: null });
      localStorage.removeItem("authToken");
    }
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ token: null, user: null });
  },
}));
