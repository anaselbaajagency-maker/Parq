import { NextRequest, NextResponse } from 'next/server';

// Middleware is disabled for Static Export as it's not supported
export default function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: []
};
