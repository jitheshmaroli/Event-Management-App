import type { PriceBreakDownProps } from "@/types/service";

export default function PriceBreakdown({ amount, days }: PriceBreakDownProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Price per day</span>
          <span>₹{amount / days}</span>
        </div>
        <div className="flex justify-between">
          <span>Total ({days} days)</span>
          <span className="font-bold text-xl">₹{amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
