import { addTasks} from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const requestData = await req.json();
        const result = await addTasks(requestData);

        if (result.status) {
            return NextResponse.json({
                status: 200,
                message: "Task added successfully",
            });
        } else {
            return NextResponse.json({
                status: 404,
                message: "Failed to add task: " + result.message
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}
