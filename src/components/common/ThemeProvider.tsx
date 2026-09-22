"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type Theme = "light" | "dark";

type ThemeMode =
  | "Light"
  | "Dark"
  | "System";

type PublicSettingsResponse = {
  success: boolean;

  settings?: {
    theme: ThemeMode;
    primaryColor: string;
    logoUrl: string;
  };

  message?: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

/* =========================================================
   CONSTANTS
========================================================= */

const USER_THEME_KEY =
  "tv-supreme-user-theme";

const PUBLIC_THEME_KEY =
  "tv-supreme-public-theme-mode";

const SETTINGS_UPDATED_EVENT =
  "tv-supreme-settings-updated";

const DEFAULT_PRIMARY_COLOR =
  "#EC008C";

/* =========================================================
   CONTEXT
========================================================= */

const ThemeContext =
  createContext<
    ThemeContextType | undefined
  >(undefined);

/* =========================================================
   HELPERS
========================================================= */

function isAdminPath(
  pathname: string
): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

function isThemeMode(
  value: unknown
): value is ThemeMode {
  return (
    value === "Light" ||
    value === "Dark" ||
    value === "System"
  );
}

function isTheme(
  value: unknown
): value is Theme {
  return (
    value === "light" ||
    value === "dark"
  );
}

function getSystemTheme(): Theme {
  if (
    typeof window === "undefined"
  ) {
    return "light";
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

function resolveTheme(
  mode: ThemeMode
): Theme {
  if (mode === "Dark") {
    return "dark";
  }

  if (mode === "System") {
    return getSystemTheme();
  }

  return "light";
}

/* =========================================================
   PROVIDER
========================================================= */

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname() || "/";

  const isAdmin =
    isAdminPath(pathname);

  const [siteThemeMode, setSiteThemeMode] =
    useState<ThemeMode>("System");

  const [primaryColor, setPrimaryColor] =
    useState(
      DEFAULT_PRIMARY_COLOR
    );

  const [userOverride, setUserOverride] =
    useState<Theme | null>(null);

  const [theme, setTheme] =
    useState<Theme>("light");

  /* =======================================================
     LOAD USER OVERRIDE
  ======================================================== */

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      if (isAdmin) {
        setUserOverride(null);
        setTheme("light");
        return;
      }

      const saved =
        localStorage.getItem(
          USER_THEME_KEY
        );

      if (isTheme(saved)) {
        setUserOverride(saved);
      } else {
        setUserOverride(null);
      }
    }, 0);

    return () => {
      window.clearTimeout(syncTimer);
    };
  }, [isAdmin]);

  /* =======================================================
     LOAD PUBLIC SETTINGS FROM DATABASE
  ======================================================== */

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    let cancelled = false;

    async function loadPublicSettings() {
      try {
        const response =
          await fetch(
            `/api/public/settings?_=${Date.now()}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Public settings request failed: ${response.status}`
          );
        }

        const data: PublicSettingsResponse =
          await response.json();

        if (
          !data.success ||
          !data.settings
        ) {
          throw new Error(
            data.message ||
              "Invalid public settings response."
          );
        }

        if (cancelled) {
          return;
        }

        const mode =
          data.settings.theme;

        if (isThemeMode(mode)) {
          setSiteThemeMode(mode);

          localStorage.setItem(
            PUBLIC_THEME_KEY,
            mode
          );
        }

        setPrimaryColor(
          data.settings.primaryColor ||
            DEFAULT_PRIMARY_COLOR
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load public settings:",
            error
          );
        }
      }
    }

    void loadPublicSettings();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, pathname]);

  /* =======================================================
     ADMIN SETTINGS → PUBLIC SITE
  ======================================================== */

  useEffect(() => {
    const handleSettingsUpdate = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          theme?: ThemeMode;
          primaryColor?: string;
        }>;

      const newMode =
        customEvent.detail?.theme;

      const newPrimaryColor =
        customEvent.detail?.primaryColor;

      if (isThemeMode(newMode)) {
        /*
         * Admin has changed the PUBLIC default.
         */
        setSiteThemeMode(newMode);

        localStorage.setItem(
          PUBLIC_THEME_KEY,
          newMode
        );

        /*
         * Remove the visitor override so the
         * new Admin setting becomes active.
         */
        localStorage.removeItem(
          USER_THEME_KEY
        );

        setUserOverride(null);
      }

      if (
        typeof newPrimaryColor ===
          "string" &&
        newPrimaryColor.trim()
      ) {
        setPrimaryColor(
          newPrimaryColor.trim()
        );
      }
    };

    window.addEventListener(
      SETTINGS_UPDATED_EVENT,
      handleSettingsUpdate
    );

    return () => {
      window.removeEventListener(
        SETTINGS_UPDATED_EVENT,
        handleSettingsUpdate
      );
    };
  }, []);

  /* =======================================================
     CROSS-TAB ADMIN SETTINGS UPDATE
  ======================================================== */

  useEffect(() => {
    const handleStorage = (
      event: StorageEvent
    ) => {
      /*
       * Admin Settings changed the public
       * default in another browser tab.
       */
      if (
        event.key ===
        PUBLIC_THEME_KEY
      ) {
        const newMode =
          event.newValue;

        if (isThemeMode(newMode)) {
          setSiteThemeMode(newMode);

          /*
           * Admin setting should now win.
           */
          localStorage.removeItem(
            USER_THEME_KEY
          );

          setUserOverride(null);
        }
      }

      /*
       * User changed their theme in another
       * public tab.
       */
      if (
        event.key ===
        USER_THEME_KEY
      ) {
        if (isTheme(event.newValue)) {
          setUserOverride(
            event.newValue
          );
        } else {
          setUserOverride(null);
        }
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =======================================================
     SYSTEM MODE
  ======================================================== */

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemChange = () => {
      /*
       * Only System mode should react
       * to operating system changes.
       */
      if (
        siteThemeMode !== "System"
      ) {
        return;
      }

      /*
       * If visitor selected their own
       * theme, respect that override.
       */
      if (userOverride) {
        return;
      }

      setTheme(
        mediaQuery.matches
          ? "dark"
          : "light"
      );
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemChange
      );
    };
  }, [
    isAdmin,
    siteThemeMode,
    userOverride,
  ]);

  /* =======================================================
     CALCULATE EFFECTIVE THEME
  ======================================================== */

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      if (isAdmin) {
        setTheme("light");
        return;
      }

      if (userOverride) {
        setTheme(userOverride);
        return;
      }

      setTheme(
        resolveTheme(
          siteThemeMode
        )
      );
    }, 0);

    return () => {
      window.clearTimeout(syncTimer);
    };
  }, [
    isAdmin,
    siteThemeMode,
    userOverride,
  ]);

  /* =======================================================
     PUBLIC USER TOGGLE
  ======================================================== */

  const toggleTheme = () => {
    if (isAdmin) {
      return;
    }

    setTheme((current) => {
      const next =
        current === "light"
          ? "dark"
          : "light";

      /*
       * This is ONLY the visitor's
       * personal preference.
       */
      setUserOverride(next);

      localStorage.setItem(
        USER_THEME_KEY,
        next
      );

      return next;
    });
  };

  /* =======================================================
     THEME CLASS
  ======================================================== */

  const publicThemeClass =
    !isAdmin &&
    theme === "dark"
      ? "dark"
      : "";

  const wrapperClass = isAdmin
    ? "tv-admin-theme"
    : `tv-public-theme ${publicThemeClass}`;

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <div
        className={`min-h-screen w-full ${wrapperClass}`}
        style={
          {
            "--tv-primary":
              primaryColor,

            "--tv-pink":
              primaryColor,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
