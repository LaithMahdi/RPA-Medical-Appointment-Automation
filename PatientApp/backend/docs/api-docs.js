const swaggerJsdoc = require("swagger-jsdoc");

const baseDefinition = {
  openapi: "3.0.3",
  info: {
    title: "PatientApp API",
    version: "1.0.0",
    description:
      "API for patient login, appointment requests, and agenda retrieval.",
  },
  components: {
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "doctor@example.com",
          },
          password: { type: "string", example: "secret-password" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          user: { type: "string", example: "Doctor" },
          role: { type: "string", example: "doctor" },
        },
      },
      SubmitAppointmentRequest: {
        type: "object",
        required: [
          "firstName",
          "lastName",
          "email",
          "phone",
          "gender",
          "reason",
          "appointmentDate",
          "appointmentTime",
        ],
        properties: {
          firstName: { type: "string", example: "Jean" },
          lastName: { type: "string", example: "Dupont" },
          email: {
            type: "string",
            format: "email",
            example: "jean.dupont@example.com",
          },
          phone: { type: "string", example: "0123456789" },
          gender: { type: "string", example: "Masculin" },
          reason: { type: "string", example: "Consultation générale" },
          appointmentDate: {
            type: "string",
            format: "date",
            example: "2026-05-15",
          },
          appointmentTime: { type: "string", example: "10:30" },
          notes: { type: "string", example: "Patient préfère le matin." },
        },
      },
      SubmitAppointmentResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Données enregistrées avec succès !",
          },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "string", example: "RDV-001" },
          nom: { type: "string", example: "Jean Dupont" },
          telephone: { type: "string", example: "0123456789" },
          email: { type: "string", example: "jean.dupont@example.com" },
          gender: { type: "string", example: "Masculin" },
          motif: { type: "string", example: "Consultation générale" },
          heure: { type: "string", example: "10:30" },
          requestedHeure: { type: "string", example: "10:00" },
          statut: { type: "string", example: "En attente" },
          date: { type: "string", example: "29/04/2026" },
          notes: { type: "string", example: "Premier rendez-vous." },
          isRescheduled: { type: "boolean", example: true },
        },
      },
    },
  },
  servers: [
    { url: "http://localhost:8080", description: "Local development server" },
  ],
};

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a doctor or secretary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             doctor:
 *               summary: Doctor login
 *               value:
 *                 email: doctor@example.com
 *                 password: secret-password
 *     responses:
 *       200:
 *         description: Authentication succeeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               user: Doctor
 *               role: doctor
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Identifiants invalides
 * /api/appointments:
 *   get:
 *     tags:
 *       - Agenda
 *     summary: Retrieve all appointment requests and their current agenda status
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *             example:
 *               - id: RDV-001
 *                 nom: Jean Dupont
 *                 telephone: '0123456789'
 *                 email: jean.dupont@example.com
 *                 gender: Masculin
 *                 motif: Consultation générale
 *                 heure: '10:30'
 *                 requestedHeure: '10:00'
 *                 statut: En attente
 *                 date: 29/04/2026
 *                 notes: Premier rendez-vous.
 *                 isRescheduled: true
 *       500:
 *         description: Failed to read appointment data
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de la lecture des données.
 * /api/submit:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Save a new appointment request into the Excel workbook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitAppointmentRequest'
 *           examples:
 *             patientRequest:
 *               summary: Patient appointment request
 *               value:
 *                 firstName: Jean
 *                 lastName: Dupont
 *                 email: jean.dupont@example.com
 *                 phone: '0123456789'
 *                 gender: Masculin
 *                 reason: Consultation générale
 *                 appointmentDate: '2026-05-15'
 *                 appointmentTime: '10:30'
 *                 notes: Patient préfère le matin.
 *     responses:
 *       200:
 *         description: Appointment saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitAppointmentResponse'
 *             example:
 *               message: Données enregistrées avec succès !
 *       500:
 *         description: Failed to save appointment data
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de l'enregistrement des données.
 */
function buildSwaggerSpec({ serverUrl }) {
  return swaggerJsdoc({
    swaggerDefinition: {
      ...baseDefinition,
      servers: [{ url: serverUrl, description: "Local development server" }],
    },
    apis: [__filename],
  });
}

module.exports = buildSwaggerSpec;
