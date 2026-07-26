export const THEME_STORAGE_KEY = "school-theme";

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
});

export const normalizeTheme = (theme) =>
  theme === "auto" ? THEMES.SYSTEM : Object.values(THEMES).includes(theme) ? theme : THEMES.LIGHT;

export const getStoredTheme = () => {
  if (typeof window === "undefined") return THEMES.LIGHT;
  return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
};

export const getResolvedTheme = (theme) => {
  if (theme !== THEMES.SYSTEM || typeof window === "undefined") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
};

export const applyTheme = (theme) => {
  const resolvedTheme = getResolvedTheme(theme);
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.classList.toggle("dark", resolvedTheme === THEMES.DARK);
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
};
