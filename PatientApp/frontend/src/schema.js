import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  dob: z.string().min(1, "La date de naissance est requise"),
  appointmentDate: z.string().min(1, "La date de rendez-vous est requise").refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: "La date ne peut pas être dans le passé" }),
  gender: z.enum(["Masculin", "Féminin", "Autre"], {
    errorMap: () => ({ message: "Veuillez sélectionner un genre" }),
  }),
  reason: z.string().min(1, "Veuillez sélectionner un motif"),
  notes: z.string().optional(),
});
