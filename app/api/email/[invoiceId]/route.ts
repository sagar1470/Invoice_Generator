

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDb";
import InvoiceModel, { IInvoice } from "@/models/invoice.model";
import { format } from "date-fns";
import { currencyOption, TCurrencyKey } from "@/lib/utils";
import nodemailer from "nodemailer";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> } // params is a Promise in App Router
) {
  try {
    // 1️⃣ Check user session
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    // 2️⃣ Unwrap params
    const { invoiceId } = await params;
    const { subject } = await request.json();

    // 3️⃣ Connect to DB
    await connectDB();

    // 4️⃣ Find invoice
    const invoiceData: IInvoice | null = await InvoiceModel.findById(invoiceId);
    if (!invoiceData) {
      return NextResponse.json({ message: "No invoice found" }, { status: 404 });
    }

    // 5️⃣ Invoice URL
    const invoiceURL =
      `${process.env.DOMAIN || "http://localhost:3000"}/api/invoice/${session?.user.id}/${invoiceId}`;

    // 6️⃣ Create HTML email as string (no JSX, no React)
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome, ${session?.user?.firstName}!</h1>
        <div>
          <p>Invoice No.: ${invoiceData.invoice_no}</p>
          <p>Due Date: ${format(invoiceData.due_date, "PPP")}</p>
          <p>Total: ${currencyOption[invoiceData.currency as TCurrencyKey]} ${invoiceData.total}</p>
        </div>
        <a href="${invoiceURL}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4F46E5;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        ">Download Invoice</a>
      </div>
    `;

    // 7️⃣ Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,          // your Gmail
        pass: process.env.GMAIL_APP_PASSWORD,  // 16-char App Password
      },
    });

    // 8️⃣ Send email
    const emailResponse = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: invoiceData.to.email,
      subject,
      html: emailHTML,
      replyTo: session?.user?.email as string, // recipient replies go to invoice creator
    });

    // 9️⃣ Return success
    return NextResponse.json({
      message: "Email sent successfully",
      data: emailResponse,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "Something went wrong",
    });
  }
}