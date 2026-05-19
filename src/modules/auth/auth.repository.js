const tokenStore = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  tokenType: null,
  userId: null,
  scope: null
};

export function saveToken(tokenPayload) {
  tokenStore.accessToken = tokenPayload.access_token ?? null;
  tokenStore.refreshToken = tokenPayload.refresh_token ?? null;
  tokenStore.expiresIn = tokenPayload.expires_in ?? null;
  tokenStore.tokenType = tokenPayload.token_type ?? null;
  tokenStore.userId = tokenPayload.user_id ?? null;
  tokenStore.scope = tokenPayload.scope ?? null;
}

export function getToken() {
  return { ...tokenStore };
}