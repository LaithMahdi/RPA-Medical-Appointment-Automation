import { useState } from "react";
import { useForm } from "react-hook-form";
import { LogIn, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import InlineAlert from "./InlineAlert";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: data.email,
          password: data.password,
        },
      );

      if (response.data.success) {
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userName", response.data.user);
        navigate("/agenda");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn className="text-white" size={30} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Accès Professionnel
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Connectez-vous à l'agenda médical
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <FormInput
            label="Email"
            name="email"
            register={register}
            registerOptions={{ required: "Email requis" }}
            error={errors.email}
            icon={Mail}
            type="email"
            placeholder="docteur@exemple.com"
          />

          <FormInput
            label="Mot de passe"
            name="password"
            register={register}
            registerOptions={{ required: "Mot de passe requis" }}
            error={errors.password}
            icon={Lock}
            type="password"
            placeholder="••••••••"
          />

          <InlineAlert message={error} />

          <SubmitButton
            isSubmitting={isLoading}
            label="Se connecter"
            loadingLabel="Connexion..."
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
