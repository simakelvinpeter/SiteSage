import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { RequestHandler } from "express";

function signingKey() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  mkdirSync("instance", { recursive: true });
  const file = "instance/session-key";
  if (!existsSync(file)) writeFileSync(file, randomBytes(48).toString("hex"), { mode: 0o600, flag: "wx" });
  return readFileSync(file, "utf8");
}

export function visitorSession(): RequestHandler {
  const secret = signingKey();
  const sign = (id: string) => createHmac("sha256", secret).update(id).digest("hex");
  return (req, res, next) => {
    const cookie = req.headers.cookie?.split(";").map((value) => value.trim())
      .find((value) => value.startsWith("sitesage="))?.slice(9) || "";
    let [id, signature] = cookie.split(".");
    const expected = sign(id || "");
    if (!/^[a-f0-9]{48}$/.test(id || "") || signature?.length !== expected.length
      || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      id = randomBytes(24).toString("hex");
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
      res.setHeader("Set-Cookie", `sitesage=${id}.${sign(id)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${secure}`);
    }
    res.locals.owner = id;
    res.setHeader("Cache-Control", "no-store");
    next();
  };
}
