import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AgendaHeader from "./agenda/AgendaHeader";
import AgendaControls from "./agenda/AgendaControls";
import AppointmentCard from "./agenda/AppointmentCard";
import AgendaStats from "./agenda/AgendaStats";
import {
  AgendaLoadingState,
  AgendaEmptyState,
  AgendaErrorState,
} from "./agenda/AgendaStates";

const Agenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointments`,
      );
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erreur lors de la récupération des rendez-vous:", err);
      setError("Impossible de charger les rendez-vous pour le moment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userRole) {
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredAppointments = appointments.filter((app) => {
    const name = (app.nom || "").toLowerCase();
    const id = String(app.id || "").toLowerCase();
    const status = app.statut === "Traité" ? "treated" : "pending";

    const matchesSearch =
      !normalizedSearch ||
      name.includes(normalizedSearch) ||
      id.includes(normalizedSearch);

    const matchesStatus = statusFilter === "all" || statusFilter === status;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((app) => app.statut !== "Traité").length,
    treated: appointments.filter((app) => app.statut === "Traité").length,
    filtered: filteredAppointments.length,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AgendaHeader
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AgendaStats
          total={stats.total}
          pending={stats.pending}
          treated={stats.treated}
          filtered={stats.filtered}
        />

        <AgendaControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          resultCount={filteredAppointments.length}
        />

        {isLoading ? (
          <AgendaLoadingState />
        ) : error ? (
          <AgendaErrorState message={error} onRetry={fetchAppointments} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))
            ) : (
              <AgendaEmptyState />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Agenda;
