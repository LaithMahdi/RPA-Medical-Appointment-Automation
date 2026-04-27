import { Clock } from "lucide-react";

const TimeSlotSelector = ({ register, selectedTime, error }) => {
  const generateSlots = () => {
    const slots = [];
    
    // Morning session: 09:00 to 11:30
    for (let hour = 9; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Afternoon session: 14:00 to 18:00
    for (let hour = 14; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const slots = generateSlots();

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
        <Clock size={14} className="text-blue-500" />
        Créneau Horaire
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <label key={slot} className="relative group">
            <input
              type="radio"
              value={slot}
              {...register("appointmentTime")}
              className="peer sr-only"
            />
            <div className="w-full py-2 text-center text-xs font-medium border border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-400 group-active:scale-95 bg-slate-50/50">
              {slot}
            </div>
          </label>
        ))}
      </div>
      {error && <span className="text-[10px] text-red-500 font-medium ml-1">{error.message}</span>}
    </div>
  );
};

export default TimeSlotSelector;
