import prisma from "@/utils/prisma";
import { generateAccessToken } from "@/utils/tokenGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email } = (await request.json()) as {
    name: string;
    email: string;
  };
  console.log(name, email);
  const access_token = generateAccessToken(6);

  // check if the user has already in the database
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    if (user.name !== name) {
      return NextResponse.json(
        { message: "名稱與資料庫不相符，無法更新金鑰" },
        { status: 409 }
      );
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name,
        access_token: access_token,
      },
    });
    return NextResponse.json({ access_token, message: "金鑰已更新" });
  }
  await prisma.user.create({
    data: {
      name,
      email,
      access_token,
    },
  });
  return NextResponse.json({ access_token, message: "金鑰已建立" });

}
