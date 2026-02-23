import { useCallback, useMemo, useState } from "react";
import {
  SERVICE_CATEGORIES,
  type ServiceFormData,
  type Range,
} from "@/types/service";
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
import { FIXED_IMAGE_COUNT } from "@/constants/service";

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
        blockedRanges: [],
        bookedRanges: [],
      };
    }
    return {
      availableRanges: normalizeRanges(
        initialData.availability.availableRanges || [],
      ),
      blockedRanges: normalizeRanges(
        initialData.availability.blockedRanges || [],
      ),
      bookedRanges: normalizeRanges(
        initialData.availability.bookedRanges || [],
      ),
    };
  }, [initialData]);

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

  // compares against initial values
  const isDirty = useMemo(() => {
    if (form.title.trim() !== (initialData.title || "").trim()) return true;
    if (form.category !== (initialData.category || "venue")) return true;
    if (form.description.trim() !== (initialData.description || "").trim())
      return true;
    if (form.pricePerDay !== (initialData.pricePerDay ?? 0)) return true;
    if (form.location.trim() !== (initialData.location || "").trim())
      return true;
    if (form.phone.trim() !== (initialData.phone || "").trim()) return true;

    if (form.images.length > 0) return true;
    if (removedExistingImages.length > 0) return true;
    if (
      (form.existingImages?.length ?? 0) !==
      (initialData.existingImages?.length ?? 0)
    )
      return true;

    const fa = form.availability;
    const ia = normalizedInitialAvailability;

    if (fa.availableRanges.length !== ia.availableRanges.length) return true;
    if (fa.blockedRanges.length !== ia.blockedRanges.length) return true;
    if (fa.bookedRanges.length !== ia.bookedRanges.length) return true;

    const rangesEqual = (a: Range[], b: Range[]) =>
      JSON.stringify(a) === JSON.stringify(b);

    if (!rangesEqual(fa.availableRanges, ia.availableRanges)) return true;
    if (!rangesEqual(fa.blockedRanges, ia.blockedRanges)) return true;
    if (!rangesEqual(fa.bookedRanges, ia.bookedRanges)) return true;

    return false;
  }, [form, initialData, normalizedInitialAvailability, removedExistingImages]);

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
  const [newRangeReason, setNewRangeReason] = useState<string>("");
  const [rangeType, setRangeType] = useState<
    "available" | "blocked" | "booked"
  >("available");
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
          reason: last.reason || curr.reason,
        };
      } else {
        merged.push(curr);
      }
    }
    return merged;
  };

  const addOrUpdateRange = (from: string, to: string, reason?: string) => {
    if (!from || !to || isBefore(fromDateKey(to), fromDateKey(from))) {
      setFeedback({ type: "error", message: "Invalid range." });
      return;
    }

    if (isBefore(startOfDay(fromDateKey(from)), startOfDay(new Date()))) {
      setFeedback({ type: "error", message: "No past dates." });
      return;
    }

    if (rangeType !== "booked") {
      const newInterval = { start: fromDateKey(from), end: fromDateKey(to) };
      const overlapsBooked = form.availability.bookedRanges.some((r) => {
        const rStart = fromDateKey(r.from);
        const rEnd = fromDateKey(r.to);
        return newInterval.start <= rEnd && newInterval.end >= rStart;
      });

      if (overlapsBooked) {
        setFeedback({
          type: "error",
          message: "Cannot overlap booked ranges.",
        });
        return;
      }
    }

    setForm((prev) => {
      const key = `${rangeType}Ranges` as keyof typeof prev.availability;
      const updatedRanges = [...prev.availability[key]];
      const newRange = { from, to, reason: reason?.trim() || undefined };

      if (editingIndex !== null) {
        updatedRanges[editingIndex] = newRange;
      } else {
        updatedRanges.push(newRange);
      }

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [key]: mergeRanges(updatedRanges),
        },
      };
    });

    resetTemp();
    setFeedback({
      type: "success",
      message: `${editingIndex !== null ? "Updated" : "Added"} ${rangeType} period.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const resetTemp = () => {
    setTempRange([null, null]);
    setNewRangeReason("");
    setEditingIndex(null);
  };

  const editRange = (
    type: "available" | "blocked" | "booked",
    index: number,
  ) => {
    const range = form.availability[`${type}Ranges`][index];
    setTempRange([fromDateKey(range.from), fromDateKey(range.to)]);
    setNewRangeReason(range.reason || "");
    setRangeType(type);
    setEditingIndex(index);
  };

  const removeRange = (
    type: "available" | "blocked" | "booked",
    index: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [`${type}Ranges`]: prev.availability[`${type}Ranges`].filter(
          (_, i) => i !== index,
        ),
      },
    }));
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

    const submitData: Partial<ServiceFormData> = { ...form };

    if (form.images.length === 0 && removedExistingImages.length === 0) {
      delete submitData.images;
      delete submitData.removedImages;
    } else {
      submitData.removedImages =
        removedExistingImages.length > 0 ? removedExistingImages : undefined;
    }

    onSubmit(submitData as ServiceFormData);
  };

  const getDayClass = (date: Date) => {
    const dStr = toDateKey(date);
    if (
      form.availability.bookedRanges.some((r) => isInRange(dStr, r.from, r.to))
    )
      return "bg-red-200";
    if (
      form.availability.availableRanges.some((r) =>
        isInRange(dStr, r.from, r.to),
      )
    )
      return "bg-green-200";
    if (
      form.availability.blockedRanges.some((r) => isInRange(dStr, r.from, r.to))
    )
      return "bg-gray-200";
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
            Ranges are inclusive. If no available periods are set, service is
            considered always available (except blocked/booked dates).
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

        {/* Calendar + controls */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900">Select Period to Add</h4>
            <p className="text-sm text-gray-600 mt-1">
              Click and drag on calendar → optional reason → choose type →
              add/update
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
                  {rangeType !== "available" && (
                    <Input
                      value={newRangeReason}
                      onChange={(e) => setNewRangeReason(e.target.value)}
                      placeholder="Reason / Note (optional)"
                      className="mt-1"
                    />
                  )}
                </div>

                <select
                  value={rangeType}
                  onChange={(e) =>
                    setRangeType(e.target.value as typeof rangeType)
                  }
                  className="border rounded px-3 py-2 bg-white"
                >
                  <option value="available">Available (Green)</option>
                  <option value="blocked">Blocked (Gray)</option>
                  <option value="booked">Booked (Red)</option>
                </select>

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
                        newRangeReason.trim() || undefined,
                      )
                    }
                  >
                    {editingIndex !== null ? "Update" : "Add"} Period
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing ranges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Available Periods ({form.availability.availableRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {form.availability.availableRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-2.5 rounded flex justify-between text-sm items-center border border-green-200"
                >
                  <span
                    onClick={() => editRange("available", idx)}
                    className="cursor-pointer flex-1"
                  >
                    {safeFormat(range.from)} – {safeFormat(range.to)}{" "}
                    {range.reason && (
                      <span className="text-green-700">({range.reason})</span>
                    )}
                  </span>
                  <button
                    onClick={() => removeRange("available", idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {form.availability.availableRanges.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  Always available (unless blocked/booked)
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Blocked Periods ({form.availability.blockedRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {form.availability.blockedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-2.5 rounded flex justify-between text-sm items-center border border-gray-300"
                >
                  <span
                    onClick={() => editRange("blocked", idx)}
                    className="cursor-pointer flex-1"
                  >
                    {format(fromDateKey(range.from), "dd MMM yyyy")} –{" "}
                    {format(fromDateKey(range.to), "dd MMM yyyy")}{" "}
                    {range.reason && (
                      <span className="text-gray-600">({range.reason})</span>
                    )}
                  </span>
                  <button
                    onClick={() => removeRange("blocked", idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Booked Periods ({form.availability.bookedRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {form.availability.bookedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-red-50 p-2.5 rounded flex justify-between text-sm items-center border border-red-200"
                >
                  <span
                    onClick={() => editRange("booked", idx)}
                    className="cursor-pointer flex-1"
                  >
                    {format(fromDateKey(range.from), "dd MMM yyyy")} –{" "}
                    {format(fromDateKey(range.to), "dd MMM yyyy")}{" "}
                    {range.reason && (
                      <span className="text-red-700">({range.reason})</span>
                    )}
                  </span>
                  <button
                    onClick={() => removeRange("booked", idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
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
