import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { name, email} = await request.json() as {name: string, email: string};
    console.log(name, email);
    return NextResponse.json({password: "123456"});
}