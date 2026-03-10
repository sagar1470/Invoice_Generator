// import NextAuth, { DefaultSession } from "next-auth"
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import client from "./mongodb-client"
// import Nodemailer from "next-auth/providers/nodemailer"


// declare module "next-auth"{
//   interface Session {
//     user : {
//       firstName : string;
//       lastName : string;
//       currency : string;
//     } & DefaultSession['user']
//   }
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: MongoDBAdapter(client),
//   session: {
//      strategy: "jwt",
//   },
//   providers: [
//    Nodemailer({
//       server: {
//         host: "smtp.gmail.com",
//         port: 587,
//         secure:false,
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_APP_PASSWORD,
//         },
//       },
//       from: process.env.GMAIL_USER,
//     }),
//   ],
//   pages : {
//     error : '/login',
//     verifyRequest : "/verify-email",
//     signIn : "/login"
//   }
// })

import NextAuth, { DefaultSession } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./mongodb-client"
import Nodemailer from "next-auth/providers/nodemailer"

declare module "next-auth" {
  interface Session {
    user: {
      firstName: string;
      lastName: string;
      currency: string;
    } & DefaultSession['user']
  }
  
  interface User {
    firstName?: string;
    lastName?: string;
    currency?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Add trustHost for development
  trustHost: true,
  
  adapter: MongoDBAdapter(client),

  providers: [
    Nodemailer({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      from: process.env.GMAIL_USER,
    }),
  ],
  
  pages: {
    error: '/login',
    verifyRequest: "/verify-email",
    signIn: "/login"
  },

  // Add callbacks to include custom user fields in session
  callbacks: {
    async session({ session, user }) {
      // Add custom fields to session
      if (session?.user) {
        session.user.firstName = user.firstName || '';
        session.user.lastName = user.lastName || '';
        session.user.currency = user.currency || 'USD';
      }
      return session;
    },
    
    async jwt({ token, user }) {
      // Add custom fields to JWT if using JWT strategy
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.currency = user.currency;
      }
      return token;
    }
  }
})