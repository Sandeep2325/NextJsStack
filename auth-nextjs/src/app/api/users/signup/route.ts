import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); //requesting a body from frontend
    const { username, email, password } = reqBody; // Taking username email and password from reqBody
    console.log(reqBody);
    const user = await User.find({ email }); //Finding the account already exists in the same email address
    const usernameverification = await User.find({ username }); //Finding the account already exists in the same email address

    console.log(user);
    if (user.length < 0) {
      //If: email already exists then return "user already exists"
      console.log("-------");

      return NextResponse.json(
        {
          error: "email already exists",
        },
        { status: 400 }
      );
    }
    if (usernameverification.length > 0) {
      return NextResponse.json(
        {
          error: "username already exists",
        },
        { status: 400 }
      );
    }
    console.log("++++");

    //else: encyrpt/hashing password the data password using bycryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      // creating a new user account
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save(); // saving the user details to the database
    console.log(savedUser);
    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
    return NextResponse.json({
      //returning the response after user creating successfully
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
