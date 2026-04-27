import { AlertCircle } from "lucide-react";

const InlineAlert = ({ message, tone = "error" }) => {
  if (!message) {
    return null;
  }

  const toneClasses =
    tone === "error"
      ? "text-red-500 bg-red-50 border-red-100"
      : "text-blue-600 bg-blue-50 border-blue-100";

  return (
    <div
      className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${toneClasses}`}
    >
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
};

export default InlineAlert;
