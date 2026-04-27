import { Search, Filter } from "lucide-react";

const AgendaControls = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher un patient ou ID..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all">
          <Filter size={18} />
          Filtrer
        </button>
      </div>
    </div>
  );
};

export default AgendaControls;
