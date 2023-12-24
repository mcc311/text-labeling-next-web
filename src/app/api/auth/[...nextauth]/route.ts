// app/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        accessToken: { label: "Access Token", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.accessToken) {
          // Logic for validating access token
          const user = await prisma.user.findUnique({
            // where: { access_token: credentials.accessToken },
            where: { email: credentials.email },
          });
          if (user && user.access_token === credentials.accessToken) {
            return { id: user.id.toString(), name: user.name };
          }
        }
        return null; // Return null if authentication fails
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Additional NextAuth configuration...
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
