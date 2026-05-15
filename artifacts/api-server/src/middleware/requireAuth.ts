import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../lib/auth";

export type AuthedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Missing bearer token" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    (req as AuthedRequest).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

