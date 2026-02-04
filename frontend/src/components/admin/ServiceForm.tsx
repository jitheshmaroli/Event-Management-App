import { useState } from "react";
import {
  SERVICE_CATEGORIES,
  type ServiceFormData,
  type BlockedRange,
} from "@/types/service";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import ServiceImageUploader from "./ServiceImageUploader";
import { Button } from "../ui/Button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format, isBefore, startOfDay } from "date-fns";

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
  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    category: "",
    description: "",
    pricePerDay: 0,
    location: "",
    contactDetails: { phone: "" },
    availability: {
      defaultAvailable: true,
      blockedRanges: [],
    },
    images: [],
    ...initialData,
  });

  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [newRangeReason, setNewRangeReason] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Merge overlapping or adjacent ranges
  const mergeBlockedRanges = (ranges: BlockedRange[]): BlockedRange[] => {
    if (ranges.length === 0) return [];

    const sorted = [...ranges].sort((a, b) => a.from.localeCompare(b.from));
    const merged: BlockedRange[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const curr = sorted[i];
      const last = merged[merged.length - 1];

      if (curr.from <= last.to) {
        last.to = curr.to > last.to ? curr.to : last.to;
        if (curr.reason && !last.reason) last.reason = curr.reason;
      } else {
        merged.push(curr);
      }
    }
    return merged;
  };

  // Add new blocked range with validation
  const addBlockedRange = (from: string, to: string, reason?: string) => {
    if (!from || !to || isBefore(new Date(to), new Date(from))) {
      setFeedback({
        type: "error",
        message: "End date must be after or equal to start date.",
      });
      return;
    }

    if (isBefore(startOfDay(new Date(from)), startOfDay(new Date()))) {
      setFeedback({ type: "error", message: "Cannot block past dates." });
      return;
    }

    setForm((prev) => {
      const newRanges = [
        ...prev.availability.blockedRanges,
        { from, to, reason: reason?.trim() || undefined },
      ];

      return {
        ...prev,
        availability: {
          ...prev.availability,
          blockedRanges: mergeBlockedRanges(newRanges),
        },
      };
    });

    setTempRange([null, null]);
    setNewRangeReason("");
    setFeedback({ type: "success", message: "Blocked period added." });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes("contactDetails.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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
        <Input
          name="contactDetails.phone"
          value={form.contactDetails.phone}
          onChange={handleChange}
        />
      </div>

      {/* AVAILABILITY SECTION */}
      <div className="space-y-6 border-t pt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            When can customers book this service?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Choose how you want to control availability.
            <strong>Most services should use the first option</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              form.availability.defaultAvailable
                ? "border-indigo-600 bg-indigo-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() =>
              setForm((p) => ({
                ...p,
                availability: { ...p.availability, defaultAvailable: true },
              }))
            }
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="radio"
                  checked={form.availability.defaultAvailable}
                  readOnly
                  className="h-5 w-5 text-indigo-600"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-base">
                  Available every day unless I block it
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Customers can book <strong>any date</strong> in the future — I
                  only need to block days when I'm unavailable (maintenance,
                  holidays, already booked, etc.).
                </p>
                <p className="text-xs text-indigo-700 mt-2 font-medium">
                  Recommended for venues, catering, halls, photographers, most
                  services
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              !form.availability.defaultAvailable
                ? "border-indigo-600 bg-indigo-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() =>
              setForm((p) => ({
                ...p,
                availability: { ...p.availability, defaultAvailable: false },
              }))
            }
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="radio"
                  checked={!form.availability.defaultAvailable}
                  readOnly
                  className="h-5 w-5 text-indigo-600"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-base">
                  Unavailable unless I add available periods
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Customers <strong>cannot book</strong> any date unless I
                  explicitly add periods when I'm available.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Used by freelancers or services with very limited schedule
                  (rare case)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <strong>Current setting:</strong>{" "}
          {form.availability.defaultAvailable ? (
            <span className="text-green-700">
              Service is available every day — you only need to block
              unavailable dates.
            </span>
          ) : (
            <span className="text-amber-700">
              Service is unavailable by default — you must add specific periods
              when it's available.
            </span>
          )}
        </div>

        {/* Feedback message */}
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
            <h4 className="font-medium text-gray-900">
              {form.availability.defaultAvailable
                ? "Block dates when this service is NOT available"
                : "Add dates when this service IS available"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {form.availability.defaultAvailable ? (
                <>
                  Click and drag to select a period → optional reason → click
                  "Block this period"
                </>
              ) : (
                <>
                  Click and drag to select a period when you ARE available →
                  optional note → click "Add available period"
                </>
              )}
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
              dayClassName={(date) => {
                const dStr = format(date, "yyyy-MM-dd");
                return form.availability.blockedRanges.some(
                  (r) => dStr >= r.from && dStr <= r.to,
                )
                  ? "highlighted-custom"
                  : "";
              }}
            />
          </div>

          {tempRange[0] && tempRange[1] && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {form.availability.defaultAvailable
                      ? "Block"
                      : "Add available"}{" "}
                    period: {format(tempRange[0], "dd MMM yyyy")} →{" "}
                    {format(tempRange[1], "dd MMM yyyy")}
                  </p>
                  <Input
                    value={newRangeReason}
                    onChange={(e) => setNewRangeReason(e.target.value)}
                    placeholder={
                      form.availability.defaultAvailable
                        ? "Reason (optional) – e.g. Maintenance, Already booked"
                        : "Note (optional) – e.g. Wedding photography slot"
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempRange([null, null]);
                      setNewRangeReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      addBlockedRange(
                        format(tempRange[0]!, "yyyy-MM-dd"),
                        format(tempRange[1]!, "yyyy-MM-dd"),
                        newRangeReason.trim() || undefined,
                      )
                    }
                  >
                    {form.availability.defaultAvailable
                      ? "Block this period"
                      : "Add available period"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blocked ranges list */}
        {form.availability.blockedRanges.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                {form.availability.defaultAvailable
                  ? "Blocked periods"
                  : "Available periods"}{" "}
                ({form.availability.blockedRanges.length})
              </h4>
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-800 underline"
                onClick={() => {
                  if (window.confirm("Remove all periods?")) {
                    setForm((p) => ({
                      ...p,
                      availability: { ...p.availability, blockedRanges: [] },
                    }));
                    setFeedback({
                      type: "success",
                      message: "All periods removed.",
                    });
                  }
                }}
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {form.availability.blockedRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 text-sm"
                >
                  <div>
                    <span className="font-medium">
                      {range.from} → {range.to}
                    </span>
                    {range.reason && (
                      <span className="ml-3 text-red-700 text-xs">
                        ({range.reason})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        availability: {
                          ...p.availability,
                          blockedRanges: p.availability.blockedRanges.filter(
                            (_, i) => i !== idx,
                          ),
                        },
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          {form.availability.defaultAvailable
            ? "Red dates = cannot be booked"
            : "Red dates = can be booked"}
        </p>
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
