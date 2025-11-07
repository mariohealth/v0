// DEPRECATED: Supabase Auth middleware has been replaced with Firebase Authentication
// Route protection is now handled client-side using Firebase AuthProvider
// This middleware is kept minimal for now - can be extended with Firebase Admin SDK if needed

import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // Basic middleware - can be extended with Firebase Admin SDK for server-side auth checks
    // For now, client-side protection via AuthProvider is sufficient
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
