

"use client";
import Loading from "@/components/Loading";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import { IInvoice } from "@/models/invoice.model";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, CheckCircle, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface IInvoiceClientPage {
  currency: string | undefined;
  userId: string | undefined;
}

export default function InvoiceClientPage({ userId, currency }: IInvoiceClientPage) {
  const [data, setData] = useState<IInvoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/invoice?page=${page}`);
      const responseData = await response.json();

      if (response.status === 200) {
        setData(responseData.data || []);
        setTotalPage(responseData.totalPage || 1);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSendEmail = async (invoiceId: string, subject: string) => {
    try {
      toast.loading("Please wait...");
      const response = await fetch(`/api/email/${invoiceId}`, {
        method: "post",
        body: JSON.stringify({
          subject: subject,
        }),
      });

      const responsedata = await response.json();

      if (response.status === 200) {
        toast.success(responsedata.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns: ColumnDef<IInvoice>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }) => {
        return format(row.original.invoice_date, "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        return format(row.original.due_date, "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "to.name",
      header: "Client",
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const totalAmountInCurrencyFormat = new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: currency,
        }).format(row.original.total);

        return <span className="font-medium">{totalAmountInCurrencyFormat}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={`${getStatusColor(status)} border`} variant="outline">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "_id",
      header: "",
      cell: ({ row }) => {
        const invoiceId = row.original._id?.toString();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => router.push(`/api/invoice/${userId}/${invoiceId}`)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push(`/invoice/edit/${invoiceId}`)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push(`/invoice/paid/${invoiceId}`)}
                className="cursor-pointer"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Paid
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem 
                onClick={() => handleSendEmail(invoiceId as string, `Invoice from ${row.original.from.name}`)}
                className="cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your invoices
          </p>
        </div>
        <Link
          href={"/invoice/create"}
          className={cn(
            buttonVariants(),
            "cursor-pointer inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          )}
        >
          <span>+</span> Create Invoice
        </Link>
      </div>

      {/* Content Section */}
      <Card className="border-0 shadow-sm">
        {isLoading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            
            {totalPage > 1 && (
              <div className="border-t px-4 py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className={page === pageNum ? "bg-primary text-white" : ""}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() => setPage(Math.min(totalPage, page + 1))}
                        className={page === totalPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {data.length === 0 && !isLoading && (
              <div className="py-20 text-center">
                <div className="mb-4">
                  <span className="text-5xl">📄</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Get started by creating your first invoice
                </p>
                <Link
                  href={"/invoice/create"}
                  className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
                >
                  Create your first invoice
                </Link>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}