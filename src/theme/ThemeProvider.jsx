import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { applyTheme, getStoredTheme, THEMES, THEME_STORAGE_KEY } from "./theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => applyTheme(getStoredTheme()));

  const setTheme = useCallback((nextTheme) => {
    const selectedTheme = Object.values(THEMES).includes(nextTheme) ? nextTheme : THEMES.LIGHT;
    window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    setThemeState(selectedTheme);
    setResolvedTheme(applyTheme(selectedTheme));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === THEMES.SYSTEM) setResolvedTheme(applyTheme(theme));
    };
    const handleStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        const nextTheme = getStoredTheme();
        setThemeState(nextTheme);
        setResolvedTheme(applyTheme(nextTheme));
      }
    };

    handleSystemThemeChange();
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, themes: THEMES }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
