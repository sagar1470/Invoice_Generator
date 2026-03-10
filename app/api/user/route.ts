import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import UserModel from '@/models/user.model'
import { connectDB } from "@/lib/connectDb";

export async function PUT(request: NextRequest){
    try {
        const { firstName, lastName, currency} = await request.json()

        const session = await auth()

        if(!session){
            return NextResponse.json({
                message : "Un-authorized access"
            },{
                status: 401
            })
        }
        //connect to db
        await connectDB()


        const userDetails = await UserModel.findByIdAndUpdate(session?.user?.id, {
            firstName,
            lastName,
            currency,
        })
        
        const userData = await UserModel.findById(session?.user?.id);


        return NextResponse.json({
            message : "user updated successfully",
            data: userData,
            data2: userDetails
        })


    } catch (error : any) {
        return NextResponse.json({
            message : error || error.message || "Something went wrong during updating database"
        },{
            status: 500
        })
    }
}