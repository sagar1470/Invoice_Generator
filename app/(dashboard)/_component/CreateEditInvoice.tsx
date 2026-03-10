"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InvoiceSchemaZod } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, DeleteIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ICreateEditInvoice {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined | null;
  currency?: string | undefined;
  invoiceId?: string | undefined;
}

export default function CreateEditInvoice({
  firstName,
  lastName,
  email,
  currency,
  invoiceId,
}: ICreateEditInvoice) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
    reset,
  } = useForm<z.infer<typeof InvoiceSchemaZod>>({
    resolver: zodResolver(InvoiceSchemaZod),
    defaultValues: {
      items: [
        {
          item_name: "",
          quantity: 0,
          price: 0,
          total: 0,
        },
      ],
      from: {
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        email: email as string,
      },
      tax_percentage: 0,
      currency: currency,
      discount: 0,
      sub_total: 0,
      total: 0,
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/invoice?invoiceId=${invoiceId}`);
      const responseData = await response.json();

      if (response.status === 200) {
        const invoiceData = responseData.data[0];
        reset({
          ...invoiceData,
          invoice_date: new Date(invoiceData.invoice_date),
          due_date: new Date(invoiceData.due_date),
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchData();
    }
  }, [invoiceId]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  useEffect(() => {
    items.forEach((item, index) => {
      const quantity = parseFloat(item.quantity.toString()) || 0;
      const price = parseFloat(item.price.toString()) || 0;
      const total = quantity * price;
      setValue(`items.${index}.total`, total);
    });
    const sub_total = items.reduce((prev, curr) => prev + curr.total, 0);
    setValue("sub_total", sub_total);
  }, [JSON.stringify(items), setValue]);

  const handleAddNewItemRow = (e: any) => {
    e.preventDefault();
    append({
      item_name: "",
      quantity: 0,
      price: 0,
      total: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: z.infer<typeof InvoiceSchemaZod>) => {
    if (!invoiceId) {
      setIsLoading(true);
      const response = await fetch("/api/invoice", {
        method: "post",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (response.status === 200) {
        toast.success(responseData?.message);
        router.push("/invoice");
      } else {
        toast.error("Something went wrong");
      }
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/invoice", {
        method: "put",
        body: JSON.stringify({
          invoiceId,
          ...data,
        }),
      });
      const responseData = await response.json();

      if (response.status === 200) {
        toast.success("Invoice updated Successfully");
        router.push("/invoice");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sub_total = watch("sub_total") || 0;
  const discount = watch("discount") || 0;
  const sub_totalRemoveDiscount = sub_total - discount;
  const taxAmount =
    (sub_totalRemoveDiscount * watch("tax_percentage")) / 100 || 0;
  const totalAmount = sub_totalRemoveDiscount - taxAmount;

  useEffect(() => {
    setValue("total", totalAmount);
  }, [totalAmount]);

  const totalAmountInCurrencyFormat = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: currency || watch("currency") || "NPR",
  }).format(totalAmount);

  return (
    <form
      className="space-y-6 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Invoice Header */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoice_no">Invoice Number</Label>
          <div className="flex items-center">
            <div className="h-10 w-10 border border-r-0 rounded-l-md bg-muted flex items-center justify-center text-muted-foreground">
              #
            </div>
            <Input
              id="invoice_no"
              type="text"
              placeholder="INV-001"
              className="rounded-l-none h-10"
              {...register("invoice_no", { required: true })}
              disabled={isLoading}
            />
          </div>
          {errors?.invoice_no && (
            <p className="text-xs text-destructive">{errors.invoice_no.message}</p>
          )}
        </div>

        <div className="md:col-start-2"></div>

        <div className="space-y-2">
          <Label>Invoice Date</Label>
          <div className="flex items-center">
            <div className="h-10 w-10 border border-r-0 rounded-l-md bg-muted flex items-center justify-center text-muted-foreground">
              <CalendarIcon className="size-4" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 rounded-l-none",
                    !getValues("invoice_date") && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {getValues("invoice_date") ? (
                    format(getValues("invoice_date"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={getValues("invoice_date")}
                  onSelect={(date) => {
                    setValue("invoice_date", date as Date, {
                      shouldValidate: true,
                    });
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors?.invoice_date && (
            <p className="text-xs text-destructive">{errors.invoice_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <div className="flex items-center">
            <div className="h-10 w-10 border border-r-0 rounded-l-md bg-muted flex items-center justify-center text-muted-foreground">
              <CalendarIcon className="size-4" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 rounded-l-none",
                    !watch("due_date") && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {watch("due_date") ? (
                    format(watch("due_date"), "PPP")
                  ) : (
                    <span>Due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("due_date")}
                  onSelect={(date) => {
                    setValue("due_date", date as Date, {
                      shouldValidate: true,
                    });
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors?.due_date && (
            <p className="text-xs text-destructive">{errors.due_date.message}</p>
          )}
        </div>
      </div>

      {/* From & To Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">From</Label>
          <div className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Your name"
                {...register("from.name", { required: true })}
                disabled={isLoading}
              />
              {errors.from?.name && (
                <p className="text-xs text-destructive mt-1">{errors.from.name.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="your@email.com"
                {...register("from.email", { required: true })}
                disabled={isLoading}
              />
              {errors.from?.email && (
                <p className="text-xs text-destructive mt-1">{errors.from.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address line 1"
                {...register("from.address1", { required: true })}
                disabled={isLoading}
              />
              {errors.from?.address1 && (
                <p className="text-xs text-destructive mt-1">{errors.from.address1.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address line 2"
                {...register("from.address2", { required: true })}
                disabled={isLoading}
              />
              {errors.from?.address2 && (
                <p className="text-xs text-destructive mt-1">{errors.from.address2.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="City, State, ZIP"
                {...register("from.address3", { required: true })}
                disabled={isLoading}
              />
              {errors.from?.address3 && (
                <p className="text-xs text-destructive mt-1">{errors.from.address3.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">To</Label>
          <div className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Client name"
                {...register("to.name", { required: true })}
                disabled={isLoading}
              />
              {errors.to?.name && (
                <p className="text-xs text-destructive mt-1">{errors.to.name.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="client@email.com"
                {...register("to.email", { required: true })}
                disabled={isLoading}
              />
              {errors.to?.email && (
                <p className="text-xs text-destructive mt-1">{errors.to.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address line 1"
                {...register("to.address1", { required: true })}
                disabled={isLoading}
              />
              {errors.to?.address1 && (
                <p className="text-xs text-destructive mt-1">{errors.to.address1.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address line 2"
                {...register("to.address2", { required: true })}
                disabled={isLoading}
              />
              {errors.to?.address2 && (
                <p className="text-xs text-destructive mt-1">{errors.to.address2.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="City, State, ZIP"
                {...register("to.address3", { required: true })}
                disabled={isLoading}
              />
              {errors.to?.address3 && (
                <p className="text-xs text-destructive mt-1">{errors.to.address3.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Items</Label>
        
        {/* Items Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-1 py-2 bg-muted/50 rounded-md text-sm font-medium">
          <div className="col-span-5">Item</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="grid md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-5">
                <Label className="md:hidden text-xs mb-1">Item Name</Label>
                <Input
                  placeholder="Item name"
                  type="text"
                  {...register(`items.${index}.item_name`, { required: true })}
                  disabled={isLoading}
                />
                {errors.items && errors.items[index]?.item_name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.items[index]?.item_name.message}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label className="md:hidden text-xs mb-1">Quantity</Label>
                <Input
                  placeholder="Qty"
                  {...register(`items.${index}.quantity`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                />
                {errors.items && errors.items[index]?.quantity && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.items[index]?.quantity.message}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label className="md:hidden text-xs mb-1">Price</Label>
                <Input
                  placeholder="Price"
                  {...register(`items.${index}.price`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                />
                {errors.items && errors.items[index]?.price && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.items[index]?.price.message}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label className="md:hidden text-xs mb-1">Total</Label>
                <Input
                  placeholder="Total"
                  {...register(`items.${index}.total`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="md:col-span-1 flex justify-end">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isLoading}
                  >
                    <DeleteIcon className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={handleAddNewItemRow}
          className="gap-2"
        >
          <PlusCircle className="size-4" />
          Add Item
        </Button>
      </div>

      {/* Calculations */}
      <div className="border-t pt-4">
        <div className="max-w-sm ml-auto space-y-3">
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label className="text-right">Sub total:</Label>
            <Input
              disabled
              value={sub_total || ""}
              className="bg-muted text-right"
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label className="text-right">Discount:</Label>
            <Input
              placeholder="0"
              type="number"
              min="0"
              step="0.01"
              {...register("discount", { valueAsNumber: true })}
              disabled={isLoading}
              className="text-right"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label className="text-right"></Label>
            <Input
              value={sub_totalRemoveDiscount || ""}
              disabled
              className="bg-muted text-right"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label className="text-right flex items-center justify-end gap-2">
              Tax:
              <Input
                placeholder="%"
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="w-16 text-right"
                {...register("tax_percentage", { valueAsNumber: true })}
                disabled={isLoading}
              />
              %
            </Label>
            <Input
              value={taxAmount || ""}
              disabled
              className="bg-muted text-right"
            />
          </div>
          {errors.tax_percentage && (
            <p className="text-xs text-destructive text-right">{errors.tax_percentage.message}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 items-center pt-2 border-t">
            <Label className="text-right font-bold">Total</Label>
            <Input
              value={totalAmount || ""}
              disabled
              className="bg-primary/10 text-primary font-bold text-right"
            />
          </div>
          
          <div className="text-right text-lg font-bold text-primary">
            {totalAmountInCurrencyFormat}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          disabled={isLoading}
          placeholder="Add any additional notes here..."
          className="resize-none"
          {...register("notes")}
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        {isLoading ? "Please wait..." : invoiceId ? "Update Invoice" : "Create Invoice"}
      </Button>
    </form>
  );
}