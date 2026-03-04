import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "No data found",
  isLoading = false,
  className = "",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="p-12 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={cn(
                    "px-6 py-4 whitespace-nowrap text-sm",
                    col.className,
                  )}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : (item[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
