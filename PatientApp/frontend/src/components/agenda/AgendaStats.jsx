import { CalendarDays, Clock3, CheckCircle2, Search } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, tone }) => {
  const tones = {
    neutral: "bg-white text-slate-700 border-slate-200",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone] || tones.neutral}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-75">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon size={22} className="opacity-80" />
      </div>
    </div>
  );
};

const AgendaStats = ({ total, pending, treated, filtered }) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total"
        value={total}
        icon={CalendarDays}
        tone="neutral"
      />
      <StatCard
        title="A traiter"
        value={pending}
        icon={Clock3}
        tone="warning"
      />
      <StatCard
        title="Traites"
        value={treated}
        icon={CheckCircle2}
        tone="success"
      />
      <StatCard title="Resultats" value={filtered} icon={Search} tone="info" />
    </section>
  );
};

export default AgendaStats;
