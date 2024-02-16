import { connect } from "@/dbConfig/dbConfig";

import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
connect()
export async function POST(request: NextRequest) {
    try {
        
        const reqBody = await request.json()
        console.log(reqBody)
        const { token,email,password } = reqBody
        if(password && token){
            console.log("====")
            const user = await User.findOne({
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: { $gt: Date.now() }
            })
            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 400 })
            } 
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
                user.forgotPasswordToken = undefined
                user.forgotPasswordTokenExpiry = undefined
                user.password=hashedPassword
                await user.save()
                return NextResponse.json({message:"Password changed successfully",success:true}, {status:200})
            
        }else if(email && !password){
            console.log("--------------")

            const user = await User.findOne({
                email: email,
            })
            console.log(user)
            if (user){
                await sendEmail({email:email,emailType:"RESET",userId:user._id})
                return NextResponse.json({email:user.email, message:"Email sent"}, {status:200})
            }else{
                return NextResponse.json({error:"User not found"}, {status:400})
            }
        
        }else if(!email&& !password && token){
            const user = await User.findOne({
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: { $gt: Date.now() }
            })
            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 400 })
            } else{
                return NextResponse.json({message:"Token verified"}, {status:200})
            }
        }
        
        else{
            console.log("pppp")
            return NextResponse.json({error:"returned null"},{status:404})
        }
        
    }
    catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}