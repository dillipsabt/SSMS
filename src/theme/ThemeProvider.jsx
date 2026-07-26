import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getTenantId, isSuperAdminTenant } from "../api/tenant";
import { ThemeContext } from "./ThemeContext";
import {
  ACTIVE_THEME_SCOPE_STORAGE_KEY,
  applyTheme,
  getStoredTheme,
  getThemeStorageKey,
  isThemeScopeForTenant,
  THEMES,
} from "./theme";

export function ThemeProvider({ children }) {
  const { role, userId, user } = useSelector(
    (state) => ({
      role: state.superAdminAuth?.role || state.auth?.role,
      userId: state.superAdminAuth?.userId || state.auth?.userId,
      user: state.auth?.user,
    }),
    shallowEqual,
  );
  const tenantId = isSuperAdminTenant() ? "super-admin" : getTenantId();
  const scope = useMemo(
    () => (role && (userId || user)
      ? { tenantId, portalId: role, userId: userId || user }
      : null),
    [role, tenantId, user, userId],
  );
  const storedActiveScope = typeof window === "undefined"
    ? null
    : window.localStorage.getItem(ACTIVE_THEME_SCOPE_STORAGE_KEY);
  const activeScope = scope || (isThemeScopeForTenant(storedActiveScope, tenantId) ? storedActiveScope : null);
  const storageKey = activeScope
    ? typeof activeScope === "string" ? activeScope : getThemeStorageKey(activeScope)
    : getThemeStorageKey({ tenantId, portalId: "login", userId: "guest" });

  useEffect(() => {
    if (scope) window.localStorage.setItem(ACTIVE_THEME_SCOPE_STORAGE_KEY, storageKey);
  }, [scope, storageKey]);

  return <RoleThemeProvider role={role} storageKey={storageKey}>{children}</RoleThemeProvider>;
}

function RoleThemeProvider({ children, role, storageKey }) {
  const [theme, setThemeState] = useState(() => getStoredTheme(storageKey, role));
  const [resolvedTheme, setResolvedTheme] = useState(() => applyTheme(getStoredTheme(storageKey, role)));

  const setTheme = useCallback((nextTheme) => {
    const selectedTheme = Object.values(THEMES).includes(nextTheme) ? nextTheme : THEMES.LIGHT;
    window.localStorage.setItem(storageKey, selectedTheme);
    setThemeState(selectedTheme);
    setResolvedTheme(applyTheme(selectedTheme));
  }, [storageKey]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const nextTheme = getStoredTheme(storageKey);
      setThemeState(nextTheme);
      setResolvedTheme(applyTheme(nextTheme));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [storageKey]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === THEMES.SYSTEM) setResolvedTheme(applyTheme(theme));
    };

    handleSystemThemeChange();
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== storageKey) return;

      const nextTheme = getStoredTheme(storageKey);
      setThemeState(nextTheme);
      setResolvedTheme(applyTheme(nextTheme));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, themes: THEMES }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
