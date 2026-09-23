"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type AdminTheme = "light" | "dark";

type AdminUIContextType = {
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  adminTheme: AdminTheme;
  toggleAdminTheme: () => void;
  setAdminTheme: (theme: AdminTheme) => void;
};

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined);

export function useAdminUI() {
  const context = useContext(AdminUIContext);
  if (!context) {
    throw new Error("useAdminUI must be used within an AdminShell");
  }
  return context;
}

const ADMIN_THEME_STORAGE_KEY = "tv-supreme-admin-theme";

type AdminShellProps = {
  user: {
    id: string;
    name: string;
    role: "ADMIN" | "EDITOR";
  };
  children: React.ReactNode;
};

export default function AdminShell({ user, children }: AdminShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminTheme, setAdminThemeState] = useState<AdminTheme>("light");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        setAdminThemeState(savedTheme);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setAdminThemeState("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const setAdminTheme = useCallback((newTheme: AdminTheme) => {
    setAdminThemeState(newTheme);
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleAdminTheme = useCallback(() => {
    setAdminThemeState((current) => {
      const next: AdminTheme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(ADMIN_THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isDark = adminTheme === "dark";

  return (
    <AdminUIContext.Provider
      value={{
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        adminTheme,
        toggleAdminTheme,
        setAdminTheme,
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDark
            ? "dark bg-[#0b0f19] text-slate-100"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <div className="flex min-h-screen">
          <AdminSidebar role={user.role} />

          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader
              user={{
                name: user.name,
                role: user.role,
              }}
            />

            <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminUIContext.Provider>
  );
}
