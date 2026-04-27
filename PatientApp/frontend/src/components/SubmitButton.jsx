import { ChevronRight, Loader2 } from "lucide-react";

const SubmitButton = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <span>Envoyer la demande</span>
          <ChevronRight
            className="group-hover:translate-x-1 transition-transform"
            size={20}
          />
        </>
      )}
    </button>
  );
};

export default SubmitButton;
