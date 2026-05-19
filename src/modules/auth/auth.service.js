import { randomUUID, randomBytes, createHash } from "node:crypto";
import { env } from "../../config/env.js";
import { exchangeCodeForToken } from "../mercadoLivre/meli.client.js";
import { saveToken } from "./auth.repository.js";

const authStates = new Set();
const pkceByState = new Map();

function toBase64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function generatePkce() {
  const codeVerifier = toBase64Url(randomBytes(64));
  const codeChallenge = toBase64Url(
    createHash("sha256").update(codeVerifier).digest()
  );
  return { codeVerifier, codeChallenge };
}

export function buildAuthorizationUrl() {
  const state = randomUUID();
  const { codeVerifier, codeChallenge } = generatePkce();

  authStates.add(state);
  pkceByState.set(state, codeVerifier);

  const authUrl = new URL("/authorization", env.meliAuthBase);
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: env.meliClientId,
    redirect_uri: env.meliRedirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  }).toString();

  return authUrl.toString();
}

function consumeStateAndVerifier(state) {
  if (!state || !authStates.has(state) || !pkceByState.has(state)) {
    const err = new Error("invalid_state_or_code");
    err.status = 400;
    throw err;
  }
  authStates.delete(state);
  const codeVerifier = pkceByState.get(state);
  pkceByState.delete(state);
  return codeVerifier;
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

  const codeVerifier = consumeStateAndVerifier(state);

  const tokenData = await exchangeCodeForToken({
    code: String(code),
    codeVerifier
  });

  saveToken(tokenData);
  return tokenData;
}