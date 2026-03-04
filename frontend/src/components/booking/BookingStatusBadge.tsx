interface Props {
  status: string;
}

export default function BookingStatusBadge({ status }: Props) {
  const styles =
    {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      failed: "bg-gray-100 text-gray-800 border-gray-300",
    }[status] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${styles}`}
    >
      {status}
    </span>
  );
}
