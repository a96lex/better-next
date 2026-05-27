import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import type {} from "next-auth/jwt";
import type {} from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/app/lib/auth.config";

declare module "next-auth" {
  interface User {
    isAnonymous?: boolean;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      isAnonymous?: boolean;
    } & DefaultSession["user"];
  }
  interface JWT {
    isAnonymous?: boolean;
  }
}

export const authOptions = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "anonymous",
      credentials: { name: { label: "Name", type: "text" } },
      async authorize(credentials) {
        const name =
          typeof credentials?.name === "string" ? credentials.name.trim() : "";
        if (!name) return null;
        const user = await prisma.user.create({
          data: { name, displayName: name, isAnonymous: true },
        });
        return { id: user.id, name: user.name, isAnonymous: true };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      const current = await auth();
      const anonId = current?.user?.isAnonymous ? current.user.id : null;
      if (!anonId) return true;
      const taken = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (taken) return true;
      await prisma.user.update({
        where: { id: anonId },
        data: {
          email: user.email,
          name: user.name,
          image: user.image,
          isAnonymous: false,
        },
      });
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAnonymous = user.isAnonymous;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isAnonymous = Boolean(token.isAnonymous);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export const getServerAuthSession = () => auth();
