import { useState } from "react";
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

  const normalizedInitialAvailability = initialData.availability
    ? {
        availableRanges: normalizeRanges(
          initialData.availability.availableRanges || [],
        ),
        blockedRanges: normalizeRanges(
          initialData.availability.blockedRanges || [],
        ),
        bookedRanges: normalizeRanges(
          initialData.availability.bookedRanges || [],
        ),
      }
    : {
        availableRanges: [],
        blockedRanges: [],
        bookedRanges: [],
      };

  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    category: "venue",
    description: "",
    pricePerDay: 0,
    location: "",
    phone: "",
    availability: normalizedInitialAvailability,
    images: [],
    ...initialData,
  });

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
      const updatedRanges = [...prev.availability[`${rangeType}Ranges`]];
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
          [`${rangeType}Ranges`]: mergeRanges(updatedRanges),
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded border-gray-300"
            required
          >
            <option value="">Select category</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Price per Day (₹)</label>
          <Input
            type="number"
            name="pricePerDay"
            value={form.pricePerDay || ""}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <Input name="phone" value={form.phone} onChange={handleChange} />
      </div>

      {/* AVAILABILITY SECTION */}
      <div className="space-y-6 border-t pt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Availability Settings
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Ranges are inclusive (includes start/end dates). If no available
            periods, always available minus blocks/bookings.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded border ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Calendar */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900">Select Period to Add</h4>
            <p className="text-sm text-gray-600 mt-1">
              Click and drag to select → optional reason → choose type → add
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
                    Period: {format(tempRange[0], "dd MMM yyyy")} →{" "}
                    {format(tempRange[1], "dd MMM yyyy")} (inclusive)
                  </p>
                  {rangeType !== "available" && (
                    <Input
                      value={newRangeReason}
                      onChange={(e) => setNewRangeReason(e.target.value)}
                      placeholder="Reason/Note (optional)"
                      className="mt-1"
                    />
                  )}
                </div>

                <select
                  value={rangeType}
                  onChange={(e) =>
                    setRangeType(
                      e.target.value as "available" | "blocked" | "booked",
                    )
                  }
                  className="border rounded p-2"
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

        {/* Ranges lists - with edit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Available Periods ({form.availability.availableRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.availability.availableRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-2 rounded flex justify-between text-sm items-center"
                >
                  <span
                    onClick={() => editRange("available", idx)}
                    className="cursor-pointer"
                  >
                    {safeFormat(range.from)} - {safeFormat(range.to)}{" "}
                    {range.reason ? `(${range.reason})` : ""}
                  </span>
                  <button
                    onClick={() => removeRange("available", idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {form.availability.availableRanges.length === 0 && (
                <p className="text-xs text-gray-500">Always available</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Blocked Periods ({form.availability.blockedRanges.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.availability.blockedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-2 rounded flex justify-between text-sm items-center"
                >
                  <span
                    onClick={() => editRange("blocked", idx)}
                    className="cursor-pointer"
                  >
                    {format(fromDateKey(range.from), "dd MMM yyyy")} -{" "}
                    {format(fromDateKey(range.to), "dd MMM yyyy")}{" "}
                    {range.reason ? `(${range.reason})` : ""}
                  </span>
                  <button
                    onClick={() => removeRange("blocked", idx)}
                    className="text-red-500"
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
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.availability.bookedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-red-50 p-2 rounded flex justify-between text-sm items-center"
                >
                  <span
                    onClick={() => editRange("booked", idx)}
                    className="cursor-pointer"
                  >
                    {format(fromDateKey(range.from), "dd MMM yyyy")} -{" "}
                    {format(fromDateKey(range.to), "dd MMM yyyy")}{" "}
                    {range.reason ? `(${range.reason})` : ""}
                  </span>
                  <button
                    onClick={() => removeRange("booked", idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image uploader */}
      <ServiceImageUploader
        images={form.images || []}
        existingImages={form.existingImages || []}
        onImagesChange={(files) => setForm((p) => ({ ...p, images: files }))}
        maxImages={6}
      />

      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {isLoading ? "Saving..." : "Save Service"}
        </Button>
      </div>
    </form>
  );
}
