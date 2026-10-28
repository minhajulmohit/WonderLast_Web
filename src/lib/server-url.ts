export const SERVER_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"
).replace(/\/$/, "");

export function serverApi(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/api/backend${normalizedPath}`;
}
