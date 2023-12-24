import { getToken as getTokenJwt } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;
export async function getToken(req: NextRequest) {
    const token = await getTokenJwt({ req, secret });
    return token;
}