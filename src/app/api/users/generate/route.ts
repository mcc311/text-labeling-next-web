// app/api/users/generate.ts
import { PrismaClient } from '@prisma/client';
import { generateAccessToken } from '@utils/tokenGenerator'; // We will create this utility

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { nNewUsers } = await request.json();

  try {
    const users = [];
    let csvContent = "data:text/csv;charset=utf-8,Access Token\n"; // CSV header

    for (let i = 0; i < nNewUsers; i++) {
      const accessToken = generateAccessToken(6); // 6-digit token
      const user = {
        name: accessToken,
        password: crypto.randomUUID(), // Ideally, hash this
        access_token: accessToken,
        allow_login_without_password: true,
      };
      users.push(user);
      csvContent += `${user.access_token}\n`; // Append each user to CSV content
    }

    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="access_tokens.csv"'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
