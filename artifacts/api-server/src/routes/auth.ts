import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";

import { AuthDeviceBody, AuthDeviceResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { signAccessToken } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/device", async (req, res) => {
  const body = AuthDeviceBody.parse(req.body);

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.deviceId, body.deviceId))
    .limit(1);

  const user =
    existing[0] ??
    (
      await db
        .insert(usersTable)
        .values({ deviceId: body.deviceId })
        .returning()
    )[0];

  const token = signAccessToken({ sub: user.id });
  const data = AuthDeviceResponse.parse({ token, user });
  res.json(data);
});

export default router;

