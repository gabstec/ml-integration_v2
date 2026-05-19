import { env } from "../../config/env.js";

export async function exchangeCodeForToken({ code, codeVerifier }) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.meliClientId,
    client_secret: env.meliClientSecret,
    code,
    redirect_uri: env.meliRedirectUri,
    code_verifier: codeVerifier
  });

  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.error_description || "Token exchange failed");
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}