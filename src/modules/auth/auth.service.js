import { randomUUID, randomBytes, createHash } from "node:crypto";
import { env } from "../../config/env.js";
import { exchangeCodeForToken } from "../mercadoLivre/meli.client.js";
import { saveToken } from "./auth.repository.js";

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

  const authUrl = new URL("/authorization", env.meliAuthBase);
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: env.meliClientId,
    redirect_uri: env.meliRedirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  }).toString();

  return { url: authUrl.toString(), codeVerifier };
}

export async function handleCallback({ code, error, error_description, codeVerifier }) {
  if (error) {
    const err = new Error(error_description || String(error));
    err.status = 400;
    err.details = { error, error_description };
    throw err;
  }

  if (!code) throw Object.assign(new Error("missing_code"), { status: 400 });
  if (!codeVerifier) throw Object.assign(new Error("missing_code_verifier"), { status: 400 });

  const tokenData = await exchangeCodeForToken({
    code: String(code),
    codeVerifier
  });

  saveToken(tokenData);
  return tokenData;
}