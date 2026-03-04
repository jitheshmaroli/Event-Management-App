import type { FilterField } from "@/types/service.types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FilterPanelProps<T extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  filters: T;
  fields: FilterField[];
  onApplyFilters: (filters: T) => void;
  onReset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FilterPanel<T extends Record<string, any>>({
  isOpen,
  onClose,
  filters,
  fields,
  onApplyFilters,
  onReset,
}: FilterPanelProps<T>) {
  const [localFilters, setLocalFilters] = useState<T>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setLocalFilters((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {fields.map((field) => {
          switch (field.type) {
            case "select":
              return (
                <div key={field.name} className="mb-6">
                  <label className="block mb-2 text-sm font-medium">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={localFilters[field.name] ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">All</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );

            case "number":
              return (
                <div key={field.name} className="mb-6">
                  <label className="block mb-2 text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={localFilters[field.name] ?? ""}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              );

            case "date":
              return (
                <div key={field.name} className="mb-6">
                  <label className="block mb-2 text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type="date"
                    name={field.name}
                    value={localFilters[field.name] ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              );

            default:
              return null;
          }
        })}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 border rounded-lg py-2"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 text-white rounded-lg py-2"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
