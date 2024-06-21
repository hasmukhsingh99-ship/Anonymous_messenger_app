import { Awaitable, NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

async function authorize(credentials: any): Promise<any> {
  await dbConnect();

  try {
    const user = await UserModel.findOne({
      $or: [
        { email: credentials.identifier },
        { username: credentials.identifier },
      ],
    });

    if (!user) {
      throw new Error("No user found with this email");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your account before login");
    }

    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password");
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const credentialsProvider = CredentialsProvider({
  id: "credentials",
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  authorize,
});

export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
