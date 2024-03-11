/* eslint-disable no-useless-catch */
import { sign, verify } from "jsonwebtoken";

export const WEEK_IN_MS = parseInt("604800000‬");
export const MINUTES15 = 900000;

export function createUserToken({ activation_id }) {
  return sign({ activation_id }, process.env.JWT_USER_SECRET, {
    expiresIn: process.env.USER_TOKEN_EXPIRY,
  });
}

export function createAccessToken({ id }) {
  return sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

export function createRefreshToken({ id, tokenVersion }) {
  return sign({ id, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

export function sendRefreshToken(res, token) {
  res.cookie("j_rt", token, {
    expires: new Date(Date.now() + WEEK_IN_MS),
    httpOnly: true,
  });
}

export function sendAccessToken(res, token) {
  res.cookie("j_at", token, {
    expires: new Date(Date.now() + MINUTES15),
    httpOnly: true,
  });
}

// const defaultCookieOptions = {
//   httpOnly: true,
//   secure: config.isProduction,
//   sameSite: config.isProduction ? 'strict' : 'lax',
//   domain: config.baseDomain,
//   path: '/',
// }

export function verifyRefreshToken(token, _res) {
  // return verify(token, process.env.JWT_REFRESH_SECRET);
  try {
    return verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw error;
  }
}

export function verifyAccessToken(token) {
  try {
    return verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw error;
  }
}

export function isTokenExpired(expirationTime) {
  // Convert the expiration time from seconds to milliseconds
  const expirationMillis = expirationTime * 1000;

  // Get the current time in milliseconds
  const currentTimeMillis = Date.now();

  // Compare the current time with the expiration time
  return currentTimeMillis > expirationMillis;
}
