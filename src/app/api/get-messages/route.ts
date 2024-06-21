import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";

async function authenticateUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return session.user as User;
}

async function fetchUserMessages(userId: mongoose.Types.ObjectId) {
  return UserModel.aggregate([
    { $match: { _id: userId } },
    { $unwind: "$messages" },
    { $sort: { "messages.createdAt": -1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  ]);
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const user = await authenticateUser();
    console.log("User",user)
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Not Authenticated" }),
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const users = await fetchUserMessages(userId);

    console.log("User messages",users)

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messages: users[0].messages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user messages", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching user messages",
      }),
      { status: 500 }
    );
  }
}
