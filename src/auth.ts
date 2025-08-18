import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,

   session: {
    strategy: "jwt",
  },
  callbacks: {
async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin : true,},
        });

        if (dbUser) {
          token.isAdmin = dbUser.isAdmin
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.isAdmin = token.isAdmin;
        
      }
      return session;
    },
  },
});
