import { sign } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../interface/user";

const s = config.jwt.secret!;

/**
 * Generates an access token using the provided payload.
 * @param {Pick<IUser, "id" | "name" | "email" | "image" | "role">} payload - The payload containing user information to include in the token.
 * @returns {Promise<string>} A promise that resolves to the generated access token.
 */
export async function generateAccessToken(
  payload: Pick<IUser, "id" | "name" | "email" | "image" | "role">
): Promise<string> {
  return sign(payload, s, {
    expiresIn: config.jwt.accessExpiration,
  });
}

/**
 * Generates a refresh token using the provided payload.
 * @param {Pick<IUser, "id" | "name" | "email" | "image" | "role">} payload - The payload containing user information to include in the token.
 * @returns {Promise<string>} A promise that resolves to the generated refresh token.
 */
export async function generateRefreshToken(
  payload: Pick<IUser, "id" | "name" | "email" | "image" | "role">
): Promise<string> {
  return sign(payload, s, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
}
