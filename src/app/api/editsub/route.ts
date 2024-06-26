import { updateSubtask } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    const taskData = await req.json();
    const results = await updateSubtask(taskData);
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message,
    });
}