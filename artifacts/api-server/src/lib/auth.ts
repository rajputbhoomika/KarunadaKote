import jwt from "jsonwebtoken";

export type AuthPayload = {
  sub: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET must be set");
  }
  return secret;
}

export function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "30d",
  });
}

export function verifyAccessToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  if (!decoded || typeof decoded !== "object" || typeof (decoded as any).sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return { sub: (decoded as any).sub };
}

