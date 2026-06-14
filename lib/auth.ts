export function getTenantSlugFromToken(token: string) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.tenant_slug;
  } catch (error) {
    return null;
  }
}