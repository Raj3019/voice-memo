import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createAuthMiddleware } from "better-auth/api"
import { db } from "../db/index.ts"
import { users } from "../db/schema.ts"
import * as schema from "../db/schema.ts"
import * as authSchema from "../auth-schema.ts"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
    ...schema,
    ...authSchema
  }
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if(ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession
        if(newSession) {
          await db.insert(users).values({
            id: newSession.user.id,
            fullName: newSession.user.name,
            email: newSession.user.email
          })
        }
      }
    })
  }
})