import { randomUUID, randomBytes, createHash } from "node:crypto";
import { env } from "../../config/env.js";
import { exchangeCodeForToken } from "../mercadoLivre/meli.client.js";
import { saveToken } from "./auth.repository.js";

const pkceByState = new Map();

function toBase64Url(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function generatePkce() {
  const codeVerifier = toBase64Url(randomBytes(64));
  const codeChallenge = toBase64Url(createHash("sha256").update(codeVerifier).digest());
  return { codeVerifier, codeChallenge };
}

export function buildAuthorizationUrl() {
  const state = randomUUID();
  const { codeVerifier, codeChallenge } = generatePkce();

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

export async function handleCallback({ code, state, error, error_description }) {
  if (error) throw Object.assign(new Error(error_description || String(error)), { status: 400 });
  if (!code) throw Object.assign(new Error("missing_code"), { status: 400 });

  const codeVerifier = pkceByState.get(state);
  pkceByState.delete(state);

  if (!codeVerifier) throw Object.assign(new Error("missing_code_verifier"), { status: 400 });

  const tokenData = await exchangeCodeForToken({ code: String(code), codeVerifier });
  saveToken(tokenData);
  return tokenData;
}