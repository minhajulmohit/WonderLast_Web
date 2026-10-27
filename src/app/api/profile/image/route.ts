import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function hasValidImageSignature(type: string, bytes: Uint8Array): boolean {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  return (
    type === "image/webp" &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Sign in to upload a profile photo." }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Image uploads are not configured on the server." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return Response.json(
      { error: "The image must be 5 MB or smaller." },
      { status: 413 },
    );
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return Response.json(
      { error: "Choose a JPG, PNG, or WebP image." },
      { status: 415 },
    );
  }

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidImageSignature(file.type, fileBytes)) {
    return Response.json(
      { error: "The selected file is not a valid image." },
      { status: 415 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = createHash("sha256")
    .update(session.user.id)
    .digest("hex");
  const signedParameters = {
    folder: "wanderlast/profiles",
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signatureBase = Object.entries(signedParameters)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const signature = createHash("sha1")
    .update(`${signatureBase}${apiSecret}`)
    .digest("hex");
  const cloudinaryForm = new FormData();
  cloudinaryForm.set("file", new Blob([fileBytes], { type: file.type }));
  cloudinaryForm.set("api_key", apiKey);
  cloudinaryForm.set("signature", signature);
  for (const [key, value] of Object.entries(signedParameters)) {
    cloudinaryForm.set(key, value);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: "POST", body: cloudinaryForm },
    );
    const result = (await response.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !result.secure_url) {
      console.error("Cloudinary profile image upload failed:", result.error?.message);
      return Response.json(
        { error: "Could not upload the image. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary profile image upload failed:", error);
    return Response.json(
      { error: "Could not connect to image storage. Please try again." },
      { status: 502 },
    );
  }
}
