import { buildAuthorizationUrl, handleCallback } from "./auth.service.js";

export function login(req, res) {
  const { url, codeVerifier } = buildAuthorizationUrl();

  res.cookie("ml_pkce_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000
  });

  res.redirect(url);
}

export async function callback(req, res, next) {
  try {
    const codeVerifier = req.cookies?.ml_pkce_verifier;
    const tokenData = await handleCallback({ ...req.query, codeVerifier });

    res.clearCookie("ml_pkce_verifier");
    res.status(200).json(tokenData);
  } catch (error) {
    next(error);
  }
}