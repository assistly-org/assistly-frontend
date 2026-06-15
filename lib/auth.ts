export function getTenantSlugFromToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.tenant_slug;
  } catch {
    return null;
  }
}

export function isValidAccessToken(token: string | null) {
  if (!token) {
    console.log("isValidAccessToken: no token");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    const valid = !payload.exp || payload.exp >= now;
    console.log(
      "isValidAccessToken: payload=",
      payload,
      "now=",
      now,
      "valid=",
      valid,
    );
    return valid;
  } catch (e) {
    console.log("isValidAccessToken: parse error", e);
    return false;
  }
}

export function clearAccessToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
