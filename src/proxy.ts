import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000").toLowerCase();

function resolveTenant(hostHeader: string): string | null {
  const host = hostHeader.toLowerCase();
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) return null;
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    return host.slice(0, -`.${ROOT_DOMAIN}`.length);
  }
  // anything else is treated as a custom domain pointed at a published project
  return host;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // keeps the auth session fresh for Server Components on every request
  const { data: { user } } = await supabase.auth.getUser();

  const host = request.headers.get("host") || "";
  const tenant = resolveTenant(host);

  if (tenant && !request.nextUrl.pathname.startsWith("/sites")) {
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${tenant}${request.nextUrl.pathname}`;
    return NextResponse.rewrite(url, { request: { headers: response.headers } });
  }

  if (!tenant && request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
