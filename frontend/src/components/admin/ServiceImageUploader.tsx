import { useEffect, useMemo, useState } from "react";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceImageUploaderProps {
  images: File[];
  existingImages?: string[];
  onImagesChange: (files: File[]) => void;
  onRemoveExisting: (keyOrUrl: string) => void;
  maxImages?: number;
}

export default function ServiceImageUploader({
  images = [],
  existingImages = [],
  onImagesChange,
  onRemoveExisting,
  maxImages = 6,
}: ServiceImageUploaderProps) {
  const [toRemove, setToRemove] = useState<Set<string>>(new Set());

  const newPreviews = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const visibleExistingCount = existingImages.length - toRemove.size;
  const totalCurrentImages = visibleExistingCount + images.length;
  const canUploadMore = totalCurrentImages < maxImages;

  const handleRemoveExisting = (identifier: string) => {
    setToRemove((prev) => {
      const next = new Set(prev);
      if (next.has(identifier)) {
        next.delete(identifier);
      } else {
        next.add(identifier);
      }
      return next;
    });

    onRemoveExisting(identifier);
  };

  const visibleExisting = existingImages.filter((url) => !toRemove.has(url));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    const availableSlots = maxImages - totalCurrentImages;

    if (newFiles.length > availableSlots) {
      alert(
        `You can only add up to ${availableSlots} more image${
          availableSlots !== 1 ? "s" : ""
        }.`,
      );
      return;
    }

    onImagesChange([...images, ...newFiles]);
  };

  const removeNewImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Images (exactly {maxImages} required) — {totalCurrentImages} /{" "}
        {maxImages}
      </label>

      {/* Upload area - only shown when there's room */}
      {canUploadMore && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag &
                drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* Preview grid */}
      {visibleExisting.length > 0 || images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Existing images */}
          {visibleExisting.map((url, idx) => {
            const isRemoved = toRemove.has(url);
            return (
              <div
                key={`exist-${idx}`}
                className={cn(
                  "relative group rounded-md overflow-hidden border border-gray-200 shadow-sm bg-white",
                  isRemoved && "opacity-60",
                )}
              >
                <img
                  src={url}
                  alt={`Existing service image ${idx + 1}`}
                  className="h-28 w-full object-cover"
                />

                {isRemoved && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                    Marked for removal (click to undo)
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveExisting(url)}
                  className={cn(
                    "absolute top-2 right-2 z-20 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md transition-all duration-200",
                    isRemoved
                      ? "bg-green-600 opacity-100 scale-100"
                      : "bg-red-600/90 opacity-0 group-hover:opacity-100 hover:opacity-100 hover:scale-110",
                  )}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}

          {/* Newly uploaded images */}
          {newPreviews.map((preview, idx) => (
            <div
              key={`new-${idx}`}
              className="relative group rounded-md overflow-hidden border border-gray-200 shadow-sm bg-white"
            >
              <img
                src={preview}
                alt={`New upload preview ${idx + 1}`}
                className="h-28 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-2 right-2 z-20 bg-red-600/90 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 hover:scale-110 transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm">No images selected yet</p>
        </div>
      )}

      {/* Feedback when images are marked for removal */}
      {toRemove.size > 0 && (
        <p className="text-sm text-amber-700 font-medium">
          {toRemove.size} image{toRemove.size !== 1 ? "s" : ""} marked for
          removal
        </p>
      )}
    </div>
  );
}
