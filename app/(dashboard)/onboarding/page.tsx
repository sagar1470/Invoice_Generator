
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencyOption } from "@/lib/utils";
import { onboardingSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";


export default function OnboardingPage() {
    const { register, handleSubmit, control, formState: { errors }, } = useForm<z.infer<typeof onboardingSchema>>({
        resolver : zodResolver(onboardingSchema),
        defaultValues : {
             currency : "NPR"
        }
    })
    
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onSubmit = async (data : z.infer<typeof onboardingSchema>)=>{
        try {
            setIsLoading(true)
            const response = await fetch('/api/user',{
                method: "put",
                body: JSON.stringify(data)
            })
            const responseData = await response.json()

            if(response.status === 200){
                toast.success(responseData.message)
                router.push("/dashboard")
            }else{
                toast.error(responseData.message)
            }

        } catch (error) {
            
            console.log(error)

        } finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center flex-col min-h-dvh overflow-auto h-dvh relative p-4">
            <Card className="min-h-xs lg:min-w-sm w-full max-w-sm">
                <CardHeader>
                    <CardTitle>
                        You are almost finished
                    </CardTitle>

                    <CardDescription>
                        Enter your Information to create an account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="grid gap-4" onSubmit = {handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <Label>First Name</Label>
                            <Input
                                placeholder="Sagar"
                                type="text"
                                {...register("firstName", { required : true })}
                                disabled={isLoading}
                            />
                            {
                                errors.firstName && (
                                    <p className="text-xs text-red-400">
                                        {errors.firstName.message}
                                    </p>
                                )
                            }
                        </div>

                        <div className="grid gap-2">
                            <Label>Last Name</Label>
                            <Input
                                placeholder="Bista"
                                type="text"
                                {...register("lastName", { required : true })}
                                disabled={isLoading}
                            />
                             {
                                errors.lastName && (
                                    <p className="text-xs text-red-400">
                                        {errors.lastName.message}
                                    </p>
                                )
                            }

                        </div>

                        <div className="grid gap-2">
                            <Label>Select Currency</Label>
                            {/* Updated Select with Controller */}
                            <Controller
                                name="currency"
                                control={control}
                                defaultValue="NPR"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        disabled={isLoading}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {
                                                Object.keys(currencyOption).map((item: string) => (
                                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <Button disabled={isLoading}>
                            {
                                isLoading ? "Wait a while..." : "Finish Onboarding"
                            }
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}