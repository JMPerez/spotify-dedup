import { NextRequest, NextResponse } from 'next/server';

import OAuthConfig from '@/dedup/oauthConfig';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${OAuthConfig.clientId}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: OAuthConfig.redirectUri
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to exchange code for tokens' },
      { status: response.status }
    );
  }

  const tokens = await response.json();

  // Set HTTP-only cookie
  (await
    cookies()).set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

  return NextResponse.json(tokens);
} 