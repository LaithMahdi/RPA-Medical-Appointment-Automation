import { Calendar, TriangleAlert } from "lucide-react";

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
    <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
      <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
      <p className="text-slate-500 font-medium">Aucun rendez-vous trouvé.</p>
    </div>
  );
};

export const AgendaErrorState = ({ message, onRetry }) => {
  return (
    <div className="col-span-full py-16 px-4 text-center bg-red-50 rounded-3xl border border-red-100">
      <TriangleAlert className="mx-auto text-red-400 mb-4" size={44} />
      <p className="text-red-700 font-semibold">Erreur de chargement</p>
      <p className="text-red-600 text-sm mt-1">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 px-4 py-2 bg-white border border-red-200 rounded-xl text-red-700 font-medium hover:bg-red-100/40 transition-colors"
      >
        Reessayer
      </button>
    </div>
  );
};
