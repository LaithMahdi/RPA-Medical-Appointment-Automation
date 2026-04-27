import { Stethoscope } from "lucide-react";

const BrandPanel = () => {
  return (
    <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
          <Stethoscope size={28} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sante Connect</h1>
        <p className="text-blue-100 text-sm">
          Portail de demande de prise en charge patient.
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <div className="flex items-center gap-3 mb-4 text-sm text-blue-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
          <span>Rapide & Securise</span>
        </div>
        <div className="flex items-center gap-3 mb-4 text-sm text-blue-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
          <span>Traitement Automatise</span>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-50" />
      <div className="absolute top-20 -left-10 w-24 h-24 bg-blue-700 rounded-full opacity-50" />
    </div>
  );
};

export default BrandPanel;
