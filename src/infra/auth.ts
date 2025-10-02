import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { Role } from "@/domain/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.providerAccountId) {
        token.id = account.providerAccountId;
      }

      const realmAccess = profile?.realm_access as
        | { roles?: string[] }
        | undefined;
      if (realmAccess?.roles) {
        token.roles = realmAccess.roles.filter((role): role is Role =>
          ["admin", "user"].includes(role)
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.roles = token.roles || [];
      }
      return session;
    },
  },
});
