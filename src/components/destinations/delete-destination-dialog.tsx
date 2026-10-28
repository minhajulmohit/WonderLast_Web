"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { getAuthToken } from "@/lib/auth-token";

export default function DeleteDestinationDialog({
  destinationId,
  destinationName,
}: {
  destinationId: string;
  destinationName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `http://localhost:8000/all-package/${encodeURIComponent(destinationId)}`,
        {
          method: "DELETE",
          headers: { Authorization: ["Bearer", token].join(" ") },
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Request failed with status ${response.status}`);
      }

      setIsOpen(false);
      toast.add({
        title: "Travel package deleted",
        description: `${destinationName} has been removed.`,
        type: "success",
      });
      router.push("/all-destinations");
    } catch (error) {
      toast.add({
        title: "Could not delete travel package",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isDeleting) setIsOpen(open);
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 border border-red-300 px-3 text-xs text-red-500 transition-colors hover:bg-red-50"
      >
        <Trash2 aria-hidden="true" size={12} />
        Delete
      </button>

      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this travel package?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {destinationName}. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="inline-flex h-8 items-center justify-center gap-1.5 bg-red-600 px-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={14}
              />
            ) : (
              <Trash2 aria-hidden="true" size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
