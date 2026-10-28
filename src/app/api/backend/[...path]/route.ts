import { NextRequest, NextResponse } from "next/server";

const serverUrl = (
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}

async function proxy(request: NextRequest) {
  const upstreamPath = request.nextUrl.pathname.replace(/^\/api\/backend/, "");
  const upstreamUrl = new URL(`${serverUrl}${upstreamPath}${request.nextUrl.search}`);

  const headers = new Headers();
  for (const name of ["authorization", "content-type", "cookie"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer(),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "text/plain";
  return new NextResponse(response.body, {
    status: response.status,
    headers: { "content-type": contentType },
  });
}
