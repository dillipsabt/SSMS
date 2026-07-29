import { getTenantId, isLocalHost } from "../api/tenant";

const API_PATH = "/api";
const DEFAULT_DEVELOPMENT_ORIGIN = "http://localhost:8080";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const ensureAbsoluteUrl = (value, variableName) => {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    if (import.meta.env.DEV) {
      console.warn(`Ignoring invalid ${variableName}; an absolute URL is required.`);
    }
    return "";
  }
};

const warnMissing = (variableName) => {
  if (import.meta.env.DEV) {
    console.warn(`Missing ${variableName}.`);
  }
};

const resolveConfiguredBaseUrl = (tenant) => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredUrl) return "";

  return ensureAbsoluteUrl(
    configuredUrl.replace("{tenant}", tenant),
    "VITE_API_BASE_URL",
  );
};

export const getApiBaseUrl = () => {
  const tenant = getTenantId() || import.meta.env.VITE_DEFAULT_TENANT?.trim().toLowerCase();

  if (import.meta.env.DEV) {
    const variableName = tenant ? `VITE_API_${tenant.toUpperCase()}` : "";
    const configuredBaseUrl = variableName
      ? import.meta.env[variableName]?.trim()
      : "";

    if (!configuredBaseUrl) {
      warnMissing(variableName || "VITE_TENANT_ID");
      return "";
    }

    const developmentBaseUrl = ensureAbsoluteUrl(
      configuredBaseUrl,
      variableName,
    );

    return developmentBaseUrl.endsWith(API_PATH)
      ? developmentBaseUrl
      : `${developmentBaseUrl}${API_PATH}`;
  }
  const configuredBaseUrl = resolveConfiguredBaseUrl(tenant);

  if (configuredBaseUrl) {
    return configuredBaseUrl.endsWith(API_PATH)
      ? configuredBaseUrl
      : `${configuredBaseUrl}${API_PATH}`;
  }

  if (import.meta.env.MODE === "development" || isLocalHost()) {
    const developmentOrigin =
      import.meta.env.VITE_API_DEV_ORIGIN?.trim() || DEFAULT_DEVELOPMENT_ORIGIN;
    const origin = ensureAbsoluteUrl(developmentOrigin, "VITE_API_DEV_ORIGIN");

    if (!import.meta.env.VITE_API_DEV_ORIGIN?.trim()) {
      warnMissing("VITE_API_DEV_ORIGIN");
    }

    return `${trimTrailingSlash(origin || DEFAULT_DEVELOPMENT_ORIGIN)}${API_PATH}`;
  }

  if (!tenant) {
    warnMissing("VITE_TENANT_ID");
    return "";
  }

  if (import.meta.env.MODE === "testing") {
    return `https://${tenant}.walkoutssms.com${API_PATH}`;
  }

  return `https://${tenant}.walkoutssms.com${API_PATH}`;
};

export const getApiTimeout = () => {
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
  return Number.isFinite(timeout) && timeout > 0 ? timeout : 900000;
};
