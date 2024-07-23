import { sign } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../interface/user";

const s = config.jwt.secret!;

// Generate access token
export async function generateAccessToken(
  payload: Pick<IUser, "id" | "name" | "email">
) {
  return sign(payload, s, {
    expiresIn: config.jwt.accessExpiration,
  });
}

// Generate refresh token
export async function generateRefreshToken(
  payload: Pick<IUser, "id" | "name" | "email">
) {
  return sign(payload, s, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
}
