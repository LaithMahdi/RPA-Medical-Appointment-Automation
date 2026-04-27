import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { patientSchema } from "./schema";
import BrandPanel from "./components/BrandPanel";
import SuccessView from "./components/SuccessView";
import FormInput from "./components/FormInput";
import GenderSelector from "./components/GenderSelector";
import SubmitButton from "./components/SubmitButton";

const App = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(patientSchema),
  });

  const selectedGender = watch("gender");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/submit";
      await axios.post(apiUrl, data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du formulaire.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <BrandPanel />

        <div className="md:w-2/3 p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessView onNewRequest={() => setIsSuccess(false)} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Formulaire Patient
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Veuillez remplir les informations ci-dessous.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Prenom"
                      name="firstName"
                      register={register}
                      error={errors.firstName}
                      icon={User}
                      placeholder="Jean"
                    />
                    <FormInput
                      label="Nom"
                      name="lastName"
                      register={register}
                      error={errors.lastName}
                      icon={User}
                      placeholder="Dupont"
                    />
                  </div>

                  <FormInput
                    label="Email"
                    name="email"
                    register={register}
                    error={errors.email}
                    icon={Mail}
                    placeholder="jean.dupont@example.com"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Telephone"
                      name="phone"
                      register={register}
                      error={errors.phone}
                      icon={Phone}
                      placeholder="01 23 45 67 89"
                    />
                    <FormInput
                      label="Date de Naissance"
                      name="dob"
                      register={register}
                      error={errors.dob}
                      icon={Calendar}
                      type="date"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Date de Rendez-vous"
                      name="appointmentDate"
                      register={register}
                      error={errors.appointmentDate}
                      icon={Calendar}
                      type="date"
                    />
                    <GenderSelector
                      register={register}
                      selectedGender={selectedGender}
                      error={errors.gender}
                    />
                  </div>

                  <FormInput
                    label="Motif de consultation"
                    name="reason"
                    register={register}
                    error={errors.reason}
                    icon={FileText}
                    options={[
                      "Consultation générale",
                      "Renouvellement ordonnance",
                      "Résultat analyses",
                      "Douleurs dorsales",
                      "Suivi tension artérielle"
                    ]}
                  />

                  <FormInput
                    label="Notes (Optionnel)"
                    name="notes"
                    register={register}
                    error={errors.notes}
                    icon={FileText}
                    placeholder="Informations complémentaires..."
                    isTextArea
                    rows={2}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <SubmitButton isSubmitting={isSubmitting} />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
