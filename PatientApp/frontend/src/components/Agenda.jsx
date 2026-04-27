import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AgendaHeader from "./agenda/AgendaHeader";
import AgendaControls from "./agenda/AgendaControls";
import AppointmentCard from "./agenda/AppointmentCard";
import { AgendaLoadingState, AgendaEmptyState } from "./agenda/AgendaStates";

const Agenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userRole) {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointments`,
        );
        setAppointments(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des rendez-vous:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredAppointments = appointments.filter(
    (app) =>
      app.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AgendaHeader
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AgendaControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {isLoading ? (
          <AgendaLoadingState />
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
