export default function RefundPolicy() {
  return (
    <div className="bg-blue-50 p-6 rounded-xl">
      <h3 className="font-semibold mb-3">Cancellation & Refund Policy</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Full refund if cancelled ≥ 7 days before start date</li>
        <li>85% refund if cancelled between 3–6 days before</li>
        <li>No refund within 72 hours of start</li>
        <li>Refunds processed within 5–7 business days</li>
      </ul>
    </div>
  );
}
