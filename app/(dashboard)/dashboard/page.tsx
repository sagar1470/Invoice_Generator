"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { auth, signOut } from "@/lib/auth";
import { ChartInvoice } from "../_component/ChartInvoice";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { IInvoice } from "@/models/invoice.model";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import * as React from "react"
import { currencyOption } from "@/lib/utils";

const chartData = [
  { date: "2024-04-01", totalRevenue: 222, paidRevenue: 150 },
  { date: "2024-04-02", totalRevenue: 97, paidRevenue: 180 },
  { date: "2024-04-03", totalRevenue: 167, paidRevenue: 120 },
  { date: "2024-04-04", totalRevenue: 242, paidRevenue: 260 },
  { date: "2024-04-05", totalRevenue: 373, paidRevenue: 290 },
  { date: "2024-04-06", totalRevenue: 301, paidRevenue: 340 },
  { date: "2024-04-07", totalRevenue: 245, paidRevenue: 180 },
  { date: "2024-04-08", totalRevenue: 409, paidRevenue: 320 },
  { date: "2024-04-09", totalRevenue: 59, paidRevenue: 110 },
  { date: "2024-04-10", totalRevenue: 261, paidRevenue: 190 },
  { date: "2024-04-11", totalRevenue: 327, paidRevenue: 350 },
  { date: "2024-04-12", totalRevenue: 292, paidRevenue: 210 },
  { date: "2024-04-13", totalRevenue: 342, paidRevenue: 380 },
  { date: "2024-04-14", totalRevenue: 137, paidRevenue: 220 },
  { date: "2024-04-15", totalRevenue: 120, paidRevenue: 170 },
  { date: "2024-04-16", totalRevenue: 138, paidRevenue: 190 },
  { date: "2024-04-17", totalRevenue: 446, paidRevenue: 360 },
  { date: "2024-04-18", totalRevenue: 364, paidRevenue: 410 },
  { date: "2024-04-19", totalRevenue: 243, paidRevenue: 180 },
  { date: "2024-04-20", totalRevenue: 89, paidRevenue: 150 },
  { date: "2024-04-21", totalRevenue: 137, paidRevenue: 200 },
  { date: "2024-04-22", totalRevenue: 224, paidRevenue: 170 },
  { date: "2024-04-23", totalRevenue: 138, paidRevenue: 230 },
  { date: "2024-04-24", totalRevenue: 387, paidRevenue: 290 },
  { date: "2024-04-25", totalRevenue: 215, paidRevenue: 250 },
  { date: "2024-04-26", totalRevenue: 75, paidRevenue: 130 },
  { date: "2024-04-27", totalRevenue: 383, paidRevenue: 420 },
  { date: "2024-04-28", totalRevenue: 122, paidRevenue: 180 },
  { date: "2024-04-29", totalRevenue: 315, paidRevenue: 240 },
  { date: "2024-04-30", totalRevenue: 454, paidRevenue: 380 },
  { date: "2024-05-01", totalRevenue: 165, paidRevenue: 220 },
  { date: "2024-05-02", totalRevenue: 293, paidRevenue: 310 },
  { date: "2024-05-03", totalRevenue: 247, paidRevenue: 190 },
  { date: "2024-05-04", totalRevenue: 385, paidRevenue: 420 },
  { date: "2024-05-05", totalRevenue: 481, paidRevenue: 390 },
  { date: "2024-05-06", totalRevenue: 498, paidRevenue: 520 },
  { date: "2024-05-07", totalRevenue: 388, paidRevenue: 300 },
  { date: "2024-05-08", totalRevenue: 149, paidRevenue: 210 },
  { date: "2024-05-09", totalRevenue: 227, paidRevenue: 180 },
  { date: "2024-05-10", totalRevenue: 293, paidRevenue: 330 },
  { date: "2024-05-11", totalRevenue: 335, paidRevenue: 270 },
  { date: "2024-05-12", totalRevenue: 197, paidRevenue: 240 },
  { date: "2024-05-13", totalRevenue: 197, paidRevenue: 160 },
  { date: "2024-05-14", totalRevenue: 448, paidRevenue: 490 },
  { date: "2024-05-15", totalRevenue: 473, paidRevenue: 380 },
  { date: "2024-05-16", totalRevenue: 338, paidRevenue: 400 },
  { date: "2024-05-17", totalRevenue: 499, paidRevenue: 420 },
  { date: "2024-05-18", totalRevenue: 315, paidRevenue: 350 },
  { date: "2024-05-19", totalRevenue: 235, paidRevenue: 180 },
  { date: "2024-05-20", totalRevenue: 177, paidRevenue: 230 },
  { date: "2024-05-21", totalRevenue: 82, paidRevenue: 140 },
  { date: "2024-05-22", totalRevenue: 81, paidRevenue: 120 },
  { date: "2024-05-23", totalRevenue: 252, paidRevenue: 290 },
  { date: "2024-05-24", totalRevenue: 294, paidRevenue: 220 },
  { date: "2024-05-25", totalRevenue: 201, paidRevenue: 250 },
  { date: "2024-05-26", totalRevenue: 213, paidRevenue: 170 },
  { date: "2024-05-27", totalRevenue: 420, paidRevenue: 460 },
  { date: "2024-05-28", totalRevenue: 233, paidRevenue: 190 },
  { date: "2024-05-29", totalRevenue: 78, paidRevenue: 130 },
  { date: "2024-05-30", totalRevenue: 340, paidRevenue: 280 },
  { date: "2024-05-31", totalRevenue: 178, paidRevenue: 230 },
  { date: "2024-06-01", totalRevenue: 178, paidRevenue: 200 },
  { date: "2024-06-02", totalRevenue: 470, paidRevenue: 410 },
  { date: "2024-06-03", totalRevenue: 103, paidRevenue: 160 },
  { date: "2024-06-04", totalRevenue: 439, paidRevenue: 380 },
  { date: "2024-06-05", totalRevenue: 88, paidRevenue: 140 },
  { date: "2024-06-06", totalRevenue: 294, paidRevenue: 250 },
  { date: "2024-06-07", totalRevenue: 323, paidRevenue: 370 },
  { date: "2024-06-08", totalRevenue: 385, paidRevenue: 320 },
  { date: "2024-06-09", totalRevenue: 438, paidRevenue: 480 },
  { date: "2024-06-10", totalRevenue: 155, paidRevenue: 200 },
  { date: "2024-06-11", totalRevenue: 92, paidRevenue: 150 },
  { date: "2024-06-12", totalRevenue: 492, paidRevenue: 420 },
  { date: "2024-06-13", totalRevenue: 81, paidRevenue: 130 },
  { date: "2024-06-14", totalRevenue: 426, paidRevenue: 380 },
  { date: "2024-06-15", totalRevenue: 307, paidRevenue: 350 },
  { date: "2024-06-16", totalRevenue: 371, paidRevenue: 310 },
  { date: "2024-06-17", totalRevenue: 475, paidRevenue: 520 },
  { date: "2024-06-18", totalRevenue: 107, paidRevenue: 170 },
  { date: "2024-06-19", totalRevenue: 341, paidRevenue: 290 },
  { date: "2024-06-20", totalRevenue: 408, paidRevenue: 450 },
  { date: "2024-06-21", totalRevenue: 169, paidRevenue: 210 },
  { date: "2024-06-22", totalRevenue: 317, paidRevenue: 270 },
  { date: "2024-06-23", totalRevenue: 480, paidRevenue: 530 },
  { date: "2024-06-24", totalRevenue: 132, paidRevenue: 180 },
  { date: "2024-06-25", totalRevenue: 141, paidRevenue: 190 },
  { date: "2024-06-26", totalRevenue: 434, paidRevenue: 380 },
  { date: "2024-06-27", totalRevenue: 448, paidRevenue: 490 },
  { date: "2024-06-28", totalRevenue: 149, paidRevenue: 200 },
  { date: "2024-06-29", totalRevenue: 103, paidRevenue: 160 },
  { date: "2024-06-30", totalRevenue: 446, paidRevenue: 400 },
];
 
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  totalRevenue: {
    label: "Total Revenue",
    color: "var(--chart-1)",
  },
  paidRevenue: {
    label: "Paid Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;


export default function DashboardPage(){

    const [data, setData] = useState({
    totalRevenue: "$0",
    totalInvoice: 0,
    paidInvoice: 0,
    UnpaidInvoice: 0,
    recentInvoice: [],
    chartData: [],
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const responseData = await response.json();
      if (response.status === 200) {
        setData({
          totalRevenue: responseData.totalRevenue,
          totalInvoice: responseData.totalInvoice,
          paidInvoice: responseData.paidInvoice,
          UnpaidInvoice: responseData.UnpaidInvoice,
          recentInvoice: responseData.recentInvoice || [],
          chartData: responseData.chartData || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

//  time = 13:01
const columns: ColumnDef<IInvoice>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }) => {
        return format(row.original.invoice_date, "PP");
      },
    }, 
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const totalAmountInCurrencyFormat = new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.total);

        return totalAmountInCurrencyFormat;
      },
    },
    {
       accessorKey : "status",
       header : "Status",
       cell : ({row})=>{
        return <Badge>{row.original.status}</Badge>
       }
    },
  ];


    return(

        <div className="p-4 grid gap-6 lg:grid-cols-4">
          <Card className="grid gap-3">
            <CardHeader>
                <CardTitle className="text-xl">Total Revenue</CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    <p className="text-lg">{data?.totalRevenue ?? "-"}</p>
                    <span className="text-muted-foreground text-xs">last 30 days</span>
                </div>
            </CardContent>
          </Card>

          <Card className="grid gap-3">
            <CardHeader>
                <CardTitle className="text-xl">Total Invoice</CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    <p className="text-lg">{data?.totalInvoice ?? "-"}</p>
                    <span className="text-muted-foreground text-xs">last 30 days</span>
                </div>
            </CardContent>
          </Card>

          <Card className="grid gap-3">
            <CardHeader>
                <CardTitle className="text-xl">Paid Invoice</CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    <p className="text-lg">{data?.paidInvoice ?? "-"}</p>
                    <span className="text-muted-foreground text-xs">last 30 days</span>
                </div>
            </CardContent>
          </Card>

          <Card className="grid gap-3">
            <CardHeader>
                <CardTitle className="text-xl">Unpaid Invoice</CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    <p className="text-lg">{data?.UnpaidInvoice ?? "-"}</p>
                    <span className="text-muted-foreground text-xs">last 30 days</span>
                </div>
            </CardContent>
          </Card>
          
          {/* chart */}
          <Card className="lg:col-span-2">
              <ChartInvoice
              chartConfig={chartConfig}
              chartData={data.chartData}
              />
          </Card>
          

          {/* latest 10 Invoice last 30 days */}
           <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Invoice</CardTitle>
        </CardHeader>
        <CardContent>
            {
                data?.recentInvoice?.length == 0 ? (
                    <p className="py-4 text-center">No invoice found</p>
                ) : (
                    <DataTable
                        data={data?.recentInvoice}
                        columns={columns}
                    />
                )
            }

        </CardContent>
      </Card>
        </div>
    )
}

