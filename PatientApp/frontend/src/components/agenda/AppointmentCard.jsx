import { Phone, Tag, Clock } from "lucide-react";

const AppointmentCard = ({ appointment }) => {
  const statusClasses =
    appointment.statut === "Traité"
      ? "bg-green-50 text-green-700"
      : "bg-orange-50 text-orange-700";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-blue-600">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
          {appointment.id}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusClasses}`}
        >
          {appointment.statut}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4">
        {appointment.nom}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-slate-600">
          <Clock size={16} className="text-slate-400" />
          <span className="text-sm">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Phone size={16} className="text-slate-400" />
          <span className="text-sm">{appointment.telephone}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Tag size={16} className="text-slate-400" />
          <span className="text-sm italic">{appointment.motif}</span>
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
    </div>
  );
};

export default AppointmentCard;
