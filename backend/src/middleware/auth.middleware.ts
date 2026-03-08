import type { NextFunction, Request, Response } from "express"
import { auth } from "../config/auth.ts"

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

  req.user = session.user
  next()
}