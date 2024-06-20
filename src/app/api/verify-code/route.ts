import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function POST(request:Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    console.log("Received request with username:", username, "and code:", code);

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      console.log("User not found for username:", decodedUsername);
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 500 }
      );
    }

    console.log("User found:", user);

    const isCodeValid = user.verifyCode === code;
    console.log("Is code valid:", isCodeValid);

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    console.log("Is code not expired:", isCodeNotExpired);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, please signup again!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code!",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
