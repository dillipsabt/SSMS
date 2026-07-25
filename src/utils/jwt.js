const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return window.atob(padded);
};

export const parseJwt = (token) => {
  try {
    const payload = token?.split(".")[1];
    return payload ? JSON.parse(decodeBase64Url(payload)) : null;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token) => {
  const expiresAt = parseJwt(token)?.exp;
  return typeof expiresAt === "number" && expiresAt * 1000 <= Date.now();
};
