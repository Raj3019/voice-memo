import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createAuthMiddleware } from "better-auth/api"
import { db } from "../db/index.ts"
import { users } from "../db/schema.ts"
import * as schema from "../db/schema.ts"
import * as authSchema from "../auth-schema.ts"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3001"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
    ...schema,
    ...authSchema
  }
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: false
  },
  socialProviders:{
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession
      if (newSession?.user) {
        const nameFallback =
          newSession.user.name ||
          newSession.user.email.split("@")[0] ||
          "User";

        await db
          .insert(users)
          .values({
            id: newSession.user.id,
            fullName: nameFallback,
            email: newSession.user.email,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              fullName: nameFallback,
              email: newSession.user.email,
            },
          });
      }
    }),
  }
})
