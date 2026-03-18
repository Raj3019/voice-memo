import type { NextFunction, Request, Response } from "express"
import { auth } from "../config/auth.ts"
import { db } from "../db/index.ts"
import { users } from "../db/schema.ts"

declare global {
  namespace Express {
    interface Request {
      user?: typeof auth.$Infer.Session.user
    }
  }
}

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>)
  })

  if(!session){
    return res.status(401).json({message: "Session is not valid"})
  }

  const nameFallback =
    session.user.name || session.user.email.split("@")[0] || "User";

  await db
    .insert(users)
    .values({
      id: session.user.id,
      fullName: nameFallback,
      email: session.user.email,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        fullName: nameFallback,
        email: session.user.email,
      },
    });

  req.user = session.user
  next()
}
