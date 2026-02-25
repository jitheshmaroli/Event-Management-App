import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchAvailability } from "@/features/services/servicesThunks";
import { toDateKey } from "@/utils/date";
import { differenceInDays, addMonths } from "date-fns";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

type AvailabilityDatePickerProps = {
  serviceId: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  maxBookingDays: number;
};

export default function AvailabilityDatePicker({
  serviceId,
  startDate,
  endDate,
  onChange,
  maxBookingDays,
}: AvailabilityDatePickerProps) {
  const dispatch = useAppDispatch();
  const { availabilityByMonth } = useAppSelector((state) => state.services);

  useEffect(() => {
    if (!serviceId) return;

    [0, 1, 2, 3, 4].forEach((offset) => {
      const date = addMonths(new Date(), offset);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!availabilityByMonth[key]) {
        dispatch(fetchAvailability({ id: serviceId, year, month }));
      }
    });
  }, [serviceId, dispatch, availabilityByMonth]);

  const isDateAvailable = (date: Date): boolean => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const avail = availabilityByMonth[key];
    if (!avail) return false;

    const dayKey = toDateKey(date);
    return (
      avail.availableDates.includes(dayKey) &&
      // !avail.blockedDates.includes(dayKey) &&
      !avail.bookedDates.includes(dayKey)
    );
  };

  const dayClassName = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const avail = availabilityByMonth[key];
    if (!avail) return "text-gray-300 bg-gray-100";

    const dayStr = toDateKey(date);

    if (avail.bookedDates.includes(dayStr))
      return "bg-red-200 text-red-800 line-through";
    // if (avail.blockedDates.includes(dayStr))
    //   return "bg-gray-300 text-gray-500 line-through";
    if (avail.availableDates.includes(dayStr))
      return "bg-green-100 text-green-800 font-medium";

    return "text-gray-400 bg-gray-50";
  };

  const filterDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    if (startDate) {
      const daysDiff = differenceInDays(date, startDate) + 1;
      if (daysDiff > maxBookingDays) return false;
    }

    return isDateAvailable(date);
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm max-w-md mx-auto">
      <div className="flex justify-center">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={([newStart, newEnd]: [Date | null, Date | null]) => {
            onChange(newStart, newEnd);
          }}
          selected={startDate}
          inline
          minDate={new Date()}
          maxDate={addMonths(new Date(), 6)}
          filterDate={filterDate}
          dayClassName={dayClassName}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Click start date → navigate months → click end date
      </p>
    </div>
  );
}
