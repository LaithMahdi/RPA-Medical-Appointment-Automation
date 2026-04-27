import { Phone, Tag, Clock, CalendarDays } from "lucide-react";

const AppointmentCard = ({ appointment }) => {
  const isTreated = appointment.statut === "Traité";
  const statusClasses = isTreated
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : "bg-amber-50 text-amber-700 border-amber-100";

  const safeDate = appointment.date ? new Date(appointment.date) : null;
  const formattedDate =
    safeDate && !Number.isNaN(safeDate.getTime())
      ? safeDate.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : appointment.date || "Date non précisée";

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
          #{appointment.id || "N/A"}
        </span>
        <span
          className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest ${statusClasses}`}
        >
          {appointment.statut || "Inconnu"}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4">
        {appointment.nom || "Patient inconnu"}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-slate-600">
          <CalendarDays size={16} className="text-slate-400" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Clock size={16} className="text-slate-400" />
          <div className="flex flex-col">
            <span
              className={`text-sm ${appointment.isRescheduled ? "text-amber-600 font-bold" : "font-medium"}`}
            >
              {appointment.heure || "Heure non précisée"}
            </span>
            {appointment.isRescheduled && (
              <span className="text-[10px] text-slate-400 line-through">
                (Prévu: {appointment.requestedHeure})
              </span>
            )}
          </div>
          {appointment.isRescheduled && (
            <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded uppercase tracking-wider">
              Reprogrammé
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Phone size={16} className="text-slate-400" />
          <span className="text-sm">
            {appointment.telephone || "Telephone non fourni"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Tag size={16} className="text-slate-400" />
          <span className="text-sm italic">
            {appointment.motif || "Sans motif"}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">
          Notes
        </p>
        <p className="text-sm text-slate-600 line-clamp-2 italic">
          {appointment.notes || "Aucune note additionnelle."}
        </p>
      </div>
    </article>
  );
};

export default AppointmentCard;
