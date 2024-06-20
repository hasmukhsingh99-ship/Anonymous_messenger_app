import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}


// declare module 'bcryptjs' {
//   export function hashSync(data: any, saltOrRounds: any): string;
//   export function compareSync(data: any, encrypted: string): boolean;
//   export function genSaltSync(rounds?: number): string;
//   export function hash(data: any, saltOrRounds: any, callback: (err: Error, encrypted: string) => void): void;
//   export function compare(data: any, encrypted: string, callback: (err: Error, same: boolean) => void): void;
//   export function genSalt(rounds: number, callback: (err: Error, salt: string) => void): void;
//   export const version: string;
// }
