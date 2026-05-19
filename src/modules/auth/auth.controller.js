import { buildAuthorizationUrl, handleCallback } from "./auth.service.js";

export function login(req, res) {
  res.redirect(buildAuthorizationUrl());
}

export async function callback(req, res, next) {
  try {
    const tokenData = await handleCallback(req.query);
    res.status(200).json(tokenData);
  } catch (error) {
    next(error);
  }
}