// app/login/actions.ts
"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  try {
    await signIn("nodemailer", {
      email: formData.get("email"),
      redirectTo: "/verify-email",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    redirect("/login?error=Verification");
  }
}