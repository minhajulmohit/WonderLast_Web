export async function getAuthToken(): Promise<string> {
  const response = await fetch("/api/auth/token", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not get an authentication token.");
  }

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("token" in data) ||
    typeof data.token !== "string"
  ) {
    throw new Error("The authentication server returned an invalid token.");
  }

  return data.token;
}
