import { useCallback, useMemo, useState } from "react";
import { type ServiceFormData, type Range } from "@/types/service.types";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import ServiceImageUploader from "./ServiceImageUploader";
import { Button } from "../ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format, isBefore, startOfDay } from "date-fns";
import {
  fromDateKey,
  isInRange,
  normalizeDateString,
  toDateKey,
} from "@/utils/date";
import { serviceSchema } from "@/utils/validations/service.validation";
import { cn } from "@/lib/utils";
import { FIXED_IMAGE_COUNT } from "@/constants/service.constants";
import { SERVICE_CATEGORIES } from "@/constants/service.constants";

interface Props {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  isLoading?: boolean;
}

export default function ServiceForm({
  initialData = {},
  onSubmit,
  isLoading = false,
}: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>(
    [],
  );

  const normalizeRanges = (ranges: Range[]) =>
    ranges.map((r) => ({
      ...r,
      from: normalizeDateString(r.from),
      to: normalizeDateString(r.to),
    }));

  const safeFormat = (dateStr: string) => {
    const d = fromDateKey(dateStr);
    return isNaN(d.getTime()) ? "Invalid date" : format(d, "dd MMM yyyy");
  };

  const normalizedInitialAvailability = useMemo(() => {
    if (!initialData.availability) {
      return {
        availableRanges: [],
        bookedRanges: [],
      };
    }
    return {
      availableRanges: normalizeRanges(
        initialData.availability.availableRanges || [],
      ),
      bookedRanges: normalizeRanges(
        initialData.availability.bookedRanges || [],
      ),
    };
  }, [initialData]);

  // Helper to compare arrays ignoring order (for ranges)
  const rangesEqual = (a: Range[], b: Range[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x.from.localeCompare(y.from));
    const sortedB = [...b].sort((x, y) => x.from.localeCompare(y.from));
    return JSON.stringify(sortedA) === JSON.stringify(sortedB);
  };

  const initialFormState: ServiceFormData = {
    title: initialData.title?.trim() || "",
    category: initialData.category || "venue",
    description: initialData.description || "",
    pricePerDay: initialData.pricePerDay ?? 0,
    location: initialData.location || "",
    phone: initialData.phone || "",
    availability: normalizedInitialAvailability,
    images: [],
    existingImages: initialData.existingImages || [],
  };

  const [form, setForm] = useState<ServiceFormData>(initialFormState);

  // Compute which fields actually changed
  const getDirtyFields = (): Partial<ServiceFormData> => {
    const dirty: Partial<ServiceFormData> = {};

    if (form.title.trim() !== (initialData.title || "").trim()) {
      dirty.title = form.title.trim();
    }
    if (form.category !== (initialData.category || "venue")) {
      dirty.category = form.category;
    }
    if (form.description.trim() !== (initialData.description || "").trim()) {
      dirty.description = form.description.trim();
    }
    if (form.pricePerDay !== (initialData.pricePerDay ?? 0)) {
      dirty.pricePerDay = form.pricePerDay;
    }
    if (form.location.trim() !== (initialData.location || "").trim()) {
      dirty.location = form.location.trim();
    }
    if (form.phone.trim() !== (initialData.phone || "").trim()) {
      dirty.phone = form.phone.trim();
    }

    // Images changed
    if (form.images.length > 0 || removedExistingImages.length > 0) {
      dirty.images = form.images;
      if (removedExistingImages.length > 0) {
        dirty.removedImages = removedExistingImages;
      }
    }

    // Availability
    const initAvail = initialData.availability || {
      availableRanges: [],
      bookedRanges: [],
    };

    if (
      !rangesEqual(
        form.availability.availableRanges,
        initAvail.availableRanges,
      ) ||
      !rangesEqual(form.availability.bookedRanges, initAvail.bookedRanges)
    ) {
      dirty.availability = {
        availableRanges: form.availability.availableRanges,
        bookedRanges: form.availability.bookedRanges,
      };
    }

    return dirty;
  };

  const dirtyFields = getDirtyFields();
  const isDirty = Object.keys(dirtyFields).length > 0;

  // Validation
  const validateForm = useCallback(() => {
    const { error } = serviceSchema.validate(form, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (!error) return {};

    const errors: Record<string, string> = {};
    error.details.forEach((err) => {
      const key = err.path.join(".");
      errors[key] = err.message;
    });
    return errors;
  }, [form]);

  const errors = useMemo(() => validateForm(), [validateForm]);
  const isValid = Object.keys(errors).length === 0;

  const currentImageCount = useMemo(() => {
    const kept =
      (form.existingImages?.length ?? 0) - (removedExistingImages?.length ?? 0);
    return kept + (form.images?.length ?? 0);
  }, [form.existingImages, removedExistingImages, form.images]);

  const isImageCountValid = currentImageCount === FIXED_IMAGE_COUNT;

  // Update canSubmit
  const canSubmit = isValid && isDirty && !isLoading && isImageCountValid;

  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const mergeRanges = (ranges: Range[]): Range[] => {
    if (ranges.length === 0) return [];
    const sorted = [...ranges].sort((a, b) => a.from.localeCompare(b.from));
    const merged: Range[] = [{ ...sorted[0] }];

    for (let i = 1; i < sorted.length; i++) {
      const curr = { ...sorted[i] };
      const last = merged[merged.length - 1];
      if (curr.from <= last.to) {
        merged[merged.length - 1] = {
          ...last,
          to: curr.to > last.to ? curr.to : last.to,
        };
      } else {
        merged.push(curr);
      }
    }
    return merged;
  };

  const addOrUpdateRange = (from: string, to: string) => {
    if (!from || !to || isBefore(fromDateKey(to), fromDateKey(from))) {
      setFeedback({ type: "error", message: "Invalid range." });
      return;
    }

    if (isBefore(startOfDay(fromDateKey(from)), startOfDay(new Date()))) {
      setFeedback({ type: "error", message: "Cannot set past dates." });
      return;
    }

    setForm((prev) => {
      const updatedRanges = [...prev.availability.availableRanges];
      const newRange = { from, to };

      if (editingIndex !== null) {
        const oldRange = prev.availability.availableRanges[editingIndex];
        const oldStart = fromDateKey(oldRange.from);
        const oldEnd = fromDateKey(oldRange.to);
        const newStart = fromDateKey(from);
        const newEnd = fromDateKey(to);

        if (newStart > oldStart || newEnd < oldEnd) {
          // Shortened → create split pieces if necessary
          const pieces: Range[] = [];

          if (newStart > oldStart) {
            pieces.push({
              from: oldRange.from,
              to: toDateKey(new Date(newStart.getTime() - 86400000)),
            });
          }

          pieces.push(newRange);

          if (newEnd < oldEnd) {
            pieces.push({
              from: toDateKey(new Date(newEnd.getTime() + 86400000)),
              to: oldRange.to,
            });
          }

          const newList = [
            ...prev.availability.availableRanges.slice(0, editingIndex),
            ...pieces,
            ...prev.availability.availableRanges.slice(editingIndex + 1),
          ];

          return {
            ...prev,
            availability: {
              ...prev.availability,
              availableRanges: mergeRanges(newList),
            },
          };
        } else {
          // Normal replace (same size or extended)
          updatedRanges[editingIndex] = newRange;
        }
      } else {
        updatedRanges.push(newRange);
      }

      return {
        ...prev,
        availability: {
          ...prev.availability,
          availableRanges: mergeRanges(updatedRanges),
        },
      };
    });

    resetTemp();
    setFeedback({
      type: "success",
      message:
        editingIndex !== null
          ? "Available period updated"
          : "Available period added",
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const resetTemp = () => {
    setTempRange([null, null]);
    setEditingIndex(null);
  };

  const editRange = (index: number) => {
    const range = form.availability.availableRanges[index];
    setTempRange([fromDateKey(range.from), fromDateKey(range.to)]);
    setEditingIndex(index);
  };

  const removeRange = (index: number) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        availableRanges: prev.availability.availableRanges.filter(
          (_, i) => i !== index,
        ),
      },
    }));
    setFeedback({ type: "success", message: "Available period removed" });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(dirtyFields as ServiceFormData);
  };

  const getDayClass = (date: Date) => {
    const dStr = toDateKey(date);
    if (
      form.availability.bookedRanges.some((r) => isInRange(dStr, r.from, r.to))
    ) {
      return "bg-red-200";
    }
    if (
      form.availability.availableRanges.some((r) =>
        isInRange(dStr, r.from, r.to),
      )
    ) {
      return "bg-green-200";
    }
    return "";
  };

  const inputClasses = (field: string) =>
    cn(
      "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 sm:text-sm",
      touched[field] &&
        errors[field] &&
        "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30",
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("title")}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("category")}
          >
            <option value="">Select category</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(inputClasses("description"), "min-h-[100px]")}
          rows={4}
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price per Day (₹)
          </label>
          <Input
            type="number"
            name="pricePerDay"
            value={form.pricePerDay || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            className={inputClasses("pricePerDay")}
          />
          {touched.pricePerDay && errors.pricePerDay && (
            <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses("location")}
          />
          {touched.location && errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10-digit Indian number (optional)"
          className={inputClasses("phone")}
        />
        {touched.phone && errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* AVAILABILITY SECTION */}
      <div className="space-y-6 border-t pt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Availability Settings
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Define when this service is available. Booked dates are managed
            automatically.
          </p>
        </div>

        {feedback && (
          <div
            className={cn(
              "p-3 rounded border",
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800",
            )}
          >
            {feedback.message}
          </div>
        )}

        {/* Calendar + controls – no type selector, no reason */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900">
              Select Period to Add or Edit
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Click and drag on calendar to create new available period
              <br />
              Click an existing green period to edit or shorten it
            </p>
          </div>

          <div className="p-4">
            <DatePicker
              inline
              selectsRange
              startDate={tempRange[0]}
              endDate={tempRange[1]}
              onChange={(update) => setTempRange(update)}
              minDate={startOfDay(new Date())}
              maxDate={addMonths(new Date(), 12)}
              dayClassName={getDayClass}
            />
          </div>

          {tempRange[0] && tempRange[1] && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {format(tempRange[0], "dd MMM yyyy")} →{" "}
                    {format(tempRange[1], "dd MMM yyyy")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetTemp}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      addOrUpdateRange(
                        toDateKey(tempRange[0]!),
                        toDateKey(tempRange[1]!),
                      )
                    }
                  >
                    {editingIndex !== null ? "Update Period" : "Add Period"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing ranges – only Available + Booked (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Available Periods ({form.availability.availableRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {form.availability.availableRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 hover:bg-green-100 transition-colors p-2.5 rounded flex justify-between text-sm items-center border border-green-200 cursor-pointer group"
                >
                  <span
                    onClick={() => editRange(idx)}
                    className="flex-1 group-hover:underline"
                  >
                    {safeFormat(range.from)} – {safeFormat(range.to)}
                  </span>
                  <button
                    onClick={() => removeRange(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {form.availability.availableRanges.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No availability set → service is available by default (except
                  booked dates)
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
              Booked Periods ({form.availability.bookedRanges.length})
              <span className="text-xs text-gray-500 font-normal">
                (managed automatically)
              </span>
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {form.availability.bookedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-red-50/70 p-2.5 rounded flex justify-between text-sm items-center border border-red-200 opacity-90"
                >
                  <span className="flex-1 cursor-default">
                    {format(fromDateKey(range.from), "dd MMM yyyy")} –{" "}
                    {format(fromDateKey(range.to), "dd MMM yyyy")}
                  </span>
                </div>
              ))}
              {form.availability.bookedRanges.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No current bookings
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <ServiceImageUploader
        images={form.images || []}
        existingImages={form.existingImages || []}
        onImagesChange={(files) => setForm((p) => ({ ...p, images: files }))}
        onRemoveExisting={(url) => {
          // Extract pure S3 key
          let key = url;
          if (url.includes("amazonaws.com")) {
            key = url.split(".com/")[1]?.split("?")[0] || url;
          }
          if (!key.startsWith("services/")) {
            key = `services/${key.split("/").pop()}`;
          }

          setRemovedExistingImages((prev) => {
            if (prev.includes(key)) return prev.filter((k) => k !== key);
            return [...prev, key];
          });
        }}
        maxImages={6}
      />

      {!isImageCountValid && (
        <p className="mt-2 text-sm font-medium text-red-600 bg-red-50 p-3 rounded border border-red-200">
          Exactly {FIXED_IMAGE_COUNT} images are required. Currently:{" "}
          {currentImageCount}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit}
          isLoading={isLoading}
          className={cn(!canSubmit && "opacity-60 cursor-not-allowed")}
        >
          {isLoading ? "Saving..." : isDirty ? "Save Changes" : "Save Service"}
        </Button>
      </div>
    </form>
  );
}
