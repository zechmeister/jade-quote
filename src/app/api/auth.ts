export function isAllowed(
  pathname: string,
  session: {
    user?: {
      id: string;
      roles?: string[];
    };
  } | null
): boolean {
  if (pathname.startsWith("/api/auth")) return true;
  if (!pathname.startsWith("/api")) return true;

  if (!session?.user?.id) return false;

  if (pathname.startsWith("/api/admin"))
    return session.user.roles?.includes("admin") ?? false;

  return true;
}
