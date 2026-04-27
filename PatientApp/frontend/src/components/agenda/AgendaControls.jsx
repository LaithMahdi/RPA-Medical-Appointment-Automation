import { Search, Filter, X } from "lucide-react";

const AgendaControls = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  resultCount,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="flex-1 max-w-xl">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Recherche patient
          </label>
          <div className="relative mt-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un patient ou ID..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-64">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Statut
          </label>
          <div className="relative mt-2">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">A traiter</option>
              <option value="treated">Traites</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{resultCount}</span>{" "}
          rendez-vous affiches
        </p>
      </div>
    </section>
  );
};

export default AgendaControls;
