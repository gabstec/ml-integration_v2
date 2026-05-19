import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { exchangeCodeForToken } from "../mercadoLivre/meli.client.js";
import { saveToken } from "./auth.repository.js";

const authStates = new Set();

export function buildAuthorizationUrl() {
  const state = randomUUID();
  authStates.add(state);

  const authUrl = new URL("/authorization", env.meliAuthBase);
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: env.meliClientId,
    redirect_uri: env.meliRedirectUri,
    state
  }).toString();

  return authUrl.toString();
}

function validateState(state) {
  if (!state || !authStates.has(state)) {
    const err = new Error("invalid_state_or_code");
    err.status = 400;
    throw err;
  }

  authStates.delete(state);
}

export async function handleCallback({ code, state, error, error_description }) {
  if (error) {
    const err = new Error(error_description || String(error));
    err.status = 400;
    err.details = { error, error_description };
    throw err;
  }

  if (!code) {
    const err = new Error("missing_code");
    err.status = 400;
    throw err;
  }

  validateState(state);

  const tokenData = await exchangeCodeForToken({ code: String(code) });
  saveToken(tokenData);

  return tokenData;
}