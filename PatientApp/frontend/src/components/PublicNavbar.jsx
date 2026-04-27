import { Link } from "react-router-dom";
import { LogIn, Stethoscope } from "lucide-react";

const PublicNavbar = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Stethoscope size={18} />
          </div>
          <div>
            <p className="text-sm font-bold">PatientApp</p>
            <p className="text-xs text-slate-500">Prise de rendez-vous</p>
          </div>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          <LogIn size={16} />
          Espace Pro
        </Link>
      </div>
    </header>
  );
};

export default PublicNavbar;
