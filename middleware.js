import { createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)",
]);

export default async function middleware(req) {
  const { default: arcjet, createMiddleware, shield } = await import('@arcjet/next');
  const { clerkMiddleware } = await import('@clerk/nextjs/server');

  const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({
        mode: 'LIVE'
      }),
    ],
  });

  const clerk = clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if (!userId && isProtectedRoute(req)) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
  });

  return createMiddleware(aj, clerk)(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};