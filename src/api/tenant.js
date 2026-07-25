const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export const getHostname = () => window.location.hostname.toLowerCase();

export const getTenantId = () => {
  const hostname = getHostname();

  if (LOCAL_HOSTS.has(hostname)) {
    return import.meta.env.VITE_TENANT_ID?.trim().toLowerCase() || "";
  }

  return hostname.split(".")[0] || "";
};

export const isLocalHost = () => LOCAL_HOSTS.has(getHostname());

export const isSuperAdminTenant = () => {
  const hostname = getHostname();
  const developmentHosts = (import.meta.env.VITE_SUPER_ADMIN_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase());

  return hostname === "superadmin.walkoutssms.com" || developmentHosts.includes(hostname);
};
