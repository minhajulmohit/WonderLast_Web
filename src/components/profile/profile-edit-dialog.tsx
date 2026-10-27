"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, LoaderCircle, Pencil, Save, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  nationality?: string | null;
  location?: string | null;
  phone?: string | null;
};

export default function ProfileEditDialog({
  user,
  onUpdated,
}: {
  user: ProfileUser;
  onUpdated: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    if (!selectedFile) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      toast.add({
        title: "Unsupported image format",
        description: "Choose a JPG, PNG, or WebP image.",
        type: "error",
      });
      setImageFile(null);
      setImagePreview(null);
      event.currentTarget.value = "";
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.add({
        title: "Image is too large",
        description: "Choose an image that is 5 MB or smaller.",
        type: "error",
      });
      setImageFile(null);
      setImagePreview(null);
      event.currentTarget.value = "";
      return;
    }

    setImageFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const nationality = formData.get("nationality")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    setIsSaving(true);

    try {
      let image = user.image ?? null;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.set("image", imageFile);
        const uploadResponse = await fetch("/api/profile/image", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = (await uploadResponse.json()) as {
          imageUrl?: string;
          error?: string;
        };
        if (!uploadResponse.ok || !uploadResult.imageUrl) {
          throw new Error(uploadResult.error || "Could not upload the image.");
        }
        image = uploadResult.imageUrl;
      }

      const { error } = await authClient.updateUser({
        name,
        image: image || null,
        nationality,
        location,
        phone,
      });

      if (error) {
        throw new Error(error.message || "Please try again.");
      }

      toast.add({
        title: "Profile updated",
        description: "Your account details have been saved.",
        type: "success",
      });
      setIsOpen(false);
      setImageFile(null);
      setImagePreview(null);
      await onUpdated();
    } catch (error) {
      toast.add({
        title: "Could not update profile",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const inputClassName =
    "mt-1 h-9 w-full border-0 bg-slate-100 px-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-cyan-500";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-full items-center justify-center gap-2 bg-cyan-600 px-4 text-xs font-medium text-white transition-colors hover:bg-cyan-700"
      >
        <Pencil aria-hidden="true" size={13} />
        Edit Profile
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsOpen(open);
        }}
      >
        <DialogContent
          className="max-h-[90vh] max-w-lg overflow-y-auto rounded-none p-5 sm:p-6"
          showCloseButton={false}
        >
          <DialogHeader className="pr-7">
            <DialogTitle className="text-sm font-medium">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Update your account details and profile photo
            </DialogDescription>
          </DialogHeader>

          <button
            type="button"
            aria-label="Close edit profile dialog"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
            className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-800 disabled:opacity-50"
          >
            <X aria-hidden="true" size={15} />
          </button>

          <div className="flex flex-col items-center text-center">
            <Avatar className="size-20 bg-cyan-100 text-cyan-800">
              {(imagePreview || user.image) && (
                <AvatarImage
                  src={imagePreview || user.image || undefined}
                  alt="Profile photo preview"
                />
              )}
              <AvatarFallback className="bg-cyan-100 text-cyan-800">
                <ImagePlus aria-hidden="true" size={24} />
              </AvatarFallback>
            </Avatar>
            <label
              className="mt-3 inline-flex h-9 cursor-pointer items-center border border-neutral-200 px-4 text-xs text-neutral-700 hover:bg-neutral-50"
              htmlFor="profile-image"
            >
              Choose image
            </label>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="profile-image"
              onChange={handleImageChange}
              type="file"
            />
            <p className="mt-1 text-[10px] text-neutral-500">
              JPG, PNG, or WebP; up to 5 MB
            </p>
            {imageFile && (
              <p className="max-w-full truncate text-[10px] text-neutral-500">
                {imageFile.name}
              </p>
            )}
          </div>

          <form
            key={JSON.stringify(user)}
            onSubmit={handleSubmit}
            className="mt-2 space-y-3"
          >
            <div>
              <label className="block text-[11px] font-medium" htmlFor="profile-name">
                Full Name
              </label>
              <input
                autoComplete="name"
                className={inputClassName}
                id="profile-name"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium" htmlFor="profile-email">
                Email Address
              </label>
              <input
                className={`${inputClassName} cursor-not-allowed text-neutral-500`}
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                aria-describedby="profile-email-note"
              />
              <p id="profile-email-note" className="mt-1 text-[10px] text-neutral-500">
                Email address cannot be changed here.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium" htmlFor="profile-nationality">
                  Nationality
                </label>
                <input
                  autoComplete="country-name"
                  className={inputClassName}
                  id="profile-nationality"
                  name="nationality"
                  defaultValue={user.nationality ?? ""}
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium" htmlFor="profile-location">
                  Location
                </label>
                <input
                  autoComplete="address-level2"
                  className={inputClassName}
                  id="profile-location"
                  name="location"
                  defaultValue={user.location ?? ""}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium" htmlFor="profile-phone">
                Phone
              </label>
              <input
                autoComplete="tel"
                className={inputClassName}
                id="profile-phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                placeholder="Add your phone number"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-1.5 border border-neutral-200 px-3 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-1.5 bg-cyan-600 px-3 text-xs text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={13}
                  />
                ) : (
                  <Save aria-hidden="true" size={13} />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
