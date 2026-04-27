import { Calendar, LogOut } from "lucide-react";

const AgendaHeader = ({ userName, userRole, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Agenda Médical</h1>
            <p className="text-xs text-slate-500 font-medium">
              {userName} ({userRole})
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default AgendaHeader;
