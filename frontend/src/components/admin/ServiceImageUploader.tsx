import { useEffect, useMemo } from "react";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";

interface ServiceImageUploaderProps {
  images: File[];
  existingImages?: string[];
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
}

export default function ServiceImageUploader({
  images = [],
  existingImages = [],
  onImagesChange,
  maxImages = 6,
}: ServiceImageUploaderProps) {
  const newPreviews = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const currentCount = images.length + existingImages.length;
    const available = maxImages - currentCount;

    if (newFiles.length > available) {
      alert(
        `You can only add up to ${available} more image${available !== 1 ? "s" : ""}.`,
      );
      return;
    }

    onImagesChange([...images, ...newFiles]);
  };

  const removeNewImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const removeExistingImage = (index: number) => {
    console.log(index);
    alert("Removing existing images is handled on save in a real application.");
  };

  const allPreviews = [...(existingImages || []), ...newPreviews];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Images (max {maxImages}) — {allPreviews.length} / {maxImages}
      </label>

      {/* Upload area */}
      {allPreviews.length < maxImages && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
      {allPreviews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {existingImages.map((url, idx) => (
            <div key={`existing-${idx}`} className="relative group">
              <img
                src={url}
                alt={`existing image ${idx + 1}`}
                className="h-28 w-full object-cover rounded-md border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {newPreviews.map((preview, idx) => (
            <div key={`new-${idx}`} className="relative group">
              <img
                src={preview}
                alt={`new image preview ${idx + 1}`}
                className="h-28 w-full object-cover rounded-md border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 border border-dashed rounded-lg">
          <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2">No images selected yet</p>
        </div>
      )}
    </div>
  );
}
