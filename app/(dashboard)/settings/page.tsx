"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import imabebase64 from "@/lib/imagebase64";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Save, Image as ImageIcon, PenSquare, Loader2, ChevronDown } from "lucide-react";

type TSignatureData = {
  name: string;
  image: string;
};

export default function SettingsPage() {
  const [logo, setLogo] = useState<string>();
  const [signatureData, setSignatureData] = useState<TSignatureData>({
    name: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignatureData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignatureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const image = await imabebase64(file);
    setSignatureData((prev) => ({ ...prev, image }));
  };

  const handleOnChangeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const image = await imabebase64(file);
    setLogo(image);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/settings");
      const responseData = await response.json();
      if (response.status === 200) {
        setLogo(responseData?.data?.invoiceLogo);
        setSignatureData(responseData?.data?.signature || { name: "", image: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, data: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings", {
        method: "post",
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        toast.success("Settings updated successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Customize your invoice branding
          </p>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {/* Invoice Logo Section */}
            <AccordionItem value="invoice-logo" className="border-b border-gray-100">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900">Invoice Logo</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload your company logo
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <form onSubmit={(e) => handleSubmit(e, { logo })} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo-upload">Logo Image</Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        onChange={handleOnChangeLogo}
                        disabled={isLoading}
                        className="mt-1.5"
                        accept="image/*"
                      />
                    </div>
                    
                    <div>
                      <Label>Preview</Label>
                      <div className="mt-1.5 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        {logo ? (
                          <div className="relative h-24 w-full max-w-[200px]">
                            <Image
                              className="object-contain"
                              src={logo}
                              fill
                              alt="Invoice logo"
                            />
                          </div>
                        ) : (
                          <div className="h-24 flex items-center justify-center">
                            <p className="text-sm text-gray-400">No logo uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Logo
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </AccordionItem>

            {/* Signature Section */}
            <AccordionItem value="signature" className="border-b-0">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <PenSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900">Invoice Signature</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add signature and name
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <form onSubmit={(e) => handleSubmit(e, { signature: signatureData })} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signature-name">Signature Name</Label>
                      <Input
                        id="signature-name"
                        type="text"
                        placeholder="Enter name"
                        value={signatureData.name}
                        onChange={onChangeSignature}
                        name="name"
                        disabled={isLoading}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signature-upload">Signature Image</Label>
                      <Input
                        id="signature-upload"
                        type="file"
                        onChange={handleSignatureImage}
                        disabled={isLoading}
                        className="mt-1.5"
                        accept="image/*"
                      />
                    </div>
                    
                    <div>
                      <Label>Preview</Label>
                      <div className="mt-1.5 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        {signatureData.image ? (
                          <div className="space-y-2">
                            <div className="relative h-20 w-full max-w-[150px]">
                              <Image
                                className="object-contain"
                                src={signatureData.image}
                                fill
                                alt="Signature"
                              />
                            </div>
                            {signatureData.name && (
                              <p className="text-sm font-medium text-gray-700">
                                {signatureData.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center">
                            <p className="text-sm text-gray-400">No signature uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Signature
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}