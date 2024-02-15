import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    const userData = await User.findById(userID).select("-password");
    return NextResponse.json({ message: "user found", data: userData });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
