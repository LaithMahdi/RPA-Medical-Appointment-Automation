import { Calendar } from "lucide-react";

export const AgendaLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 mt-4 font-medium">
        Chargement de l'agenda...
      </p>
    </div>
  );
};

export const AgendaEmptyState = () => {
  return (
    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
      <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
      <p className="text-slate-500 font-medium">Aucun rendez-vous trouvé.</p>
    </div>
  );
};
