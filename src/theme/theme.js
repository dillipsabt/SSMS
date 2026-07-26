export const THEME_STORAGE_KEY = "school-theme";
export const ACTIVE_THEME_SCOPE_STORAGE_KEY = `${THEME_STORAGE_KEY}:active-scope`;

const normalizeScopePart = (value) => encodeURIComponent(String(value ?? "unknown").trim().toLowerCase() || "unknown");

export const getThemeStoragePrefix = (tenantId) =>
  [THEME_STORAGE_KEY, tenantId].map(normalizeScopePart).join(":");

export const getThemeStorageKey = ({ tenantId, portalId, userId }) =>
  `${getThemeStoragePrefix(tenantId)}:${normalizeScopePart(portalId)}:${normalizeScopePart(userId)}`;

export const isThemeScopeForTenant = (storageKey, tenantId) =>
  storageKey?.startsWith(`${getThemeStoragePrefix(tenantId)}:`) ?? false;

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
});

export const normalizeTheme = (theme) =>
  theme === "auto" ? THEMES.SYSTEM : Object.values(THEMES).includes(theme) ? theme : THEMES.LIGHT;

export const getStoredTheme = (storageKey, legacyRole) => {
  if (typeof window === "undefined") return THEMES.LIGHT;

  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme !== null || !legacyRole) return normalizeTheme(storedTheme);

  return normalizeTheme(window.localStorage.getItem(`${THEME_STORAGE_KEY}:${legacyRole}`));
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
