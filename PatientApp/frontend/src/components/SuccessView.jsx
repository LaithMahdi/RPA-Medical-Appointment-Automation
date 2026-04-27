import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const SuccessView = ({ onNewRequest }) => {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
    >
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Demande Envoyee !</h2>
      <p className="text-slate-600">
        Votre demande a ete enregistree avec succes dans notre systeme.
      </p>
      <button
        onClick={onNewRequest}
        className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium"
      >
        Nouvelle demande
      </button>
    </motion.div>
  );
};

export default SuccessView;
