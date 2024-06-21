import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Not Authenticated",
        }),
        { status: 401 }
      );
    }

    const user: User = session.user as User;

    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: {
          messages: {
            _id: messageId,
          },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or not deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted successfully",
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to delete message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete message",
      }),
      { status: 500 }
    );
  }
}
