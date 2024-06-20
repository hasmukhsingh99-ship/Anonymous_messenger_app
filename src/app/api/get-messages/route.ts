import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const users = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      { $unwind: "$messages" },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!users) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}
