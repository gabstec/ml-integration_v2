import "dotenv/config";

const required = [
  "MELI_CLIENT_ID",
  "MELI_CLIENT_SECRET",
  "MELI_REDIRECT_URI",
  "MELI_AUTH_BASE"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 3000),
  meliClientId: process.env.MELI_CLIENT_ID,
  meliClientSecret: process.env.MELI_CLIENT_SECRET,
  meliRedirectUri: process.env.MELI_REDIRECT_URI,
  meliAuthBase: process.env.MELI_AUTH_BASE
};