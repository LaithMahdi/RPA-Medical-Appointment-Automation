import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Calendar, FileText, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { patientSchema } from "./schema";
import BrandPanel from "./components/BrandPanel";
import SuccessView from "./components/SuccessView";
import FormInput from "./components/FormInput";
import GenderSelector from "./components/GenderSelector";
import SubmitButton from "./components/SubmitButton";
import Login from "./components/Login";
import Agenda from "./components/Agenda";
import TimeSlotSelector from "./components/TimeSlotSelector";

const PatientForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(patientSchema),
    mode: "onChange"
  });

  const selectedGender = watch("gender");
  const selectedTime = watch("appointmentTime");

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["firstName", "lastName", "email", "phone", "dob", "gender"]
      : ["appointmentDate", "appointmentTime", "reason"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/submit";
      await axios.post(apiUrl, data);
      setIsSuccess(true);
      reset();
      setStep(1);
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
        className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]"
      >
        <BrandPanel />
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessView onNewRequest={() => setIsSuccess(false)} />
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-8">
                   <div className={`h-2 rounded-full transition-all duration-500 ${step >= 1 ? 'w-1/2 bg-blue-600' : 'w-0 bg-slate-200'}`}></div>
                   <div className={`h-2 rounded-full transition-all duration-500 flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {step === 1 ? "Informations Personnelles" : "Votre Rendez-vous"}
                  </h2>
                  <p className="text-slate-500 text-sm">Étape {step} sur 2</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Prenom" name="firstName" register={register} error={errors.firstName} icon={User} placeholder="Jean" />
                        <FormInput label="Nom" name="lastName" register={register} error={errors.lastName} icon={User} placeholder="Dupont" />
                      </div>
                      <FormInput label="Email" name="email" register={register} error={errors.email} icon={Mail} placeholder="jean.dupont@example.com" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Telephone" name="phone" register={register} error={errors.phone} icon={Phone} placeholder="01 23 45 67 89" />
                        <FormInput label="Date de Naissance" name="dob" register={register} error={errors.dob} icon={Calendar} type="date" />
                      </div>
                      <GenderSelector register={register} selectedGender={selectedGender} error={errors.gender} />
                      
                      <div className="pt-4">
                        <button type="button" onClick={nextStep} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                          Suivant <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                           <FormInput label="Date souhaitée" name="appointmentDate" register={register} error={errors.appointmentDate} icon={Calendar} type="date" />
                           <FormInput
                            label="Motif de consultation"
                            name="reason"
                            register={register}
                            error={errors.reason}
                            icon={FileText}
                            options={["Consultation générale", "Renouvellement ordonnance", "Résultat analyses", "Douleurs dorsales", "Suivi tension artérielle"]}
                          />
                           <FormInput label="Notes additionnelles" name="notes" register={register} error={errors.notes} icon={FileText} placeholder="Précisez ici..." isTextArea rows={3} />
                        </div>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                           <TimeSlotSelector register={register} selectedTime={selectedTime} error={errors.appointmentTime} />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                          <AlertCircle size={16} />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <button type="button" onClick={prevStep} className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                          <ChevronLeft size={20} /> Retour
                        </button>
                        <SubmitButton isSubmitting={isSubmitting} />
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
