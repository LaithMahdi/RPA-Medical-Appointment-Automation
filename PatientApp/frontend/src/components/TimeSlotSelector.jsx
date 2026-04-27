import { useEffect, useMemo } from "react";
import { Clock } from "lucide-react";
import OptionGridSelector from "./OptionGridSelector";

const TimeSlotSelector = ({
  register,
  selectedTime,
  selectedDate,
  setValue,
  error,
}) => {
  const generateHalfHourSlots = (
    startHour,
    endHour,
    includeHalfOnEndHour = false,
  ) => {
    const slots = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);

      if (hour < endHour || includeHalfOnEndHour) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    return slots;
  };

  const morningSlots = generateHalfHourSlots(9, 11, true);
  const afternoonSlots = generateHalfHourSlots(14, 18, false);

  const isToday = useMemo(() => {
    if (!selectedDate) {
      return false;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayLocal = `${year}-${month}-${day}`;
    return selectedDate === todayLocal;
  }, [selectedDate]);

  const currentMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, [isToday]);

  const isSlotDisabled = (slot) => {
    if (!isToday) {
      return false;
    }

    const [hourText, minuteText] = slot.split(":");
    const slotMinutes = Number(hourText) * 60 + Number(minuteText);

    return slotMinutes < currentMinutes;
  };

  const slotOptions = [...morningSlots, ...afternoonSlots].map((slot) => ({
    value: slot,
    label: slot,
    disabled: isSlotDisabled(slot),
  }));

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    if (isSlotDisabled(selectedTime)) {
      setValue("appointmentTime", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedTime, selectedDate, setValue]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
          Disponibilites
        </p>
        <p className="text-sm text-slate-600">
          Matin: 09:00-11:30 | Apres-midi: 14:00-18:00
        </p>
      </div>

      <OptionGridSelector
        label="Créneau Horaire"
        name="appointmentTime"
        register={register}
        selectedValue={selectedTime}
        error={error}
        options={slotOptions}
        icon={Clock}
        columnsClassName="grid-cols-3 sm:grid-cols-4"
        optionClassName="text-xs"
      />
    </div>
  );
};

export default TimeSlotSelector;
