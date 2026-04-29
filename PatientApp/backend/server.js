require("dotenv").config();
const express = require("express");
const cors = require("cors");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "PatientApp API",
    version: "1.0.0",
    description:
      "API for patient login, appointment requests, and agenda retrieval.",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Local development server",
    },
  ],
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
          password: {
            type: "string",
            example: "secret-password",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          user: {
            type: "string",
            example: "Doctor",
          },
          role: {
            type: "string",
            example: "doctor",
          },
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
          firstName: {
            type: "string",
            example: "Jean",
          },
          lastName: {
            type: "string",
            example: "Dupont",
          },
          email: {
            type: "string",
            format: "email",
            example: "jean.dupont@example.com",
          },
          phone: {
            type: "string",
            example: "0123456789",
          },
          gender: {
            type: "string",
            example: "Masculin",
          },
          reason: {
            type: "string",
            example: "Consultation générale",
          },
          appointmentDate: {
            type: "string",
            format: "date",
            example: "2026-05-15",
          },
          appointmentTime: {
            type: "string",
            example: "10:30",
          },
          notes: {
            type: "string",
            example: "Patient préfère le matin.",
          },
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
          id: {
            type: "string",
            example: "RDV-001",
          },
          nom: {
            type: "string",
            example: "Jean Dupont",
          },
          telephone: {
            type: "string",
            example: "0123456789",
          },
          email: {
            type: "string",
            example: "jean.dupont@example.com",
          },
          gender: {
            type: "string",
            example: "Masculin",
          },
          motif: {
            type: "string",
            example: "Consultation générale",
          },
          heure: {
            type: "string",
            example: "10:30",
          },
          requestedHeure: {
            type: "string",
            example: "10:00",
          },
          statut: {
            type: "string",
            example: "En attente",
          },
          date: {
            type: "string",
            example: "29/04/2026",
          },
          notes: {
            type: "string",
            example: "Premier rendez-vous.",
          },
          isRescheduled: {
            type: "boolean",
            example: true,
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: [__filename],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const EXCEL_PATH = path.join(__dirname, "../../Data/Demandes_Patients.xlsx");
const CONFIRMED_PATH = path.join(
  __dirname,
  "../../Data/RendezVous_Confirmes.xlsx",
);

// Ensure Data directory exists
const dataDir = path.dirname(EXCEL_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Login Endpoint
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
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.DOCTOR_EMAIL &&
    password === process.env.DOCTOR_PASSWORD
  ) {
    return res.json({ success: true, user: "Doctor", role: "doctor" });
  }

  if (
    email === process.env.SECRETARY_EMAIL &&
    password === process.env.SECRETARY_PASSWORD
  ) {
    return res.json({ success: true, user: "Secretaire", role: "secretary" });
  }

  res.status(401).json({ success: false, message: "Identifiants invalides" });
});

// Get Appointments Endpoint (Agenda)
/**
 * @openapi
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
 */
app.get("/api/appointments", (req, res) => {
  try {
    let demands = [];
    let confirmed = [];

    if (fs.existsSync(EXCEL_PATH)) {
      const wbDemands = xlsx.readFile(EXCEL_PATH);
      const sheetDemands = wbDemands.SheetNames.includes("Demandes")
        ? "Demandes"
        : wbDemands.SheetNames[0];
      demands = xlsx.utils
        .sheet_to_json(wbDemands.Sheets[sheetDemands])
        .filter(Boolean);
    }

    if (fs.existsSync(CONFIRMED_PATH)) {
      const wbConfirmed = xlsx.readFile(CONFIRMED_PATH);
      const sheetConfirmed = wbConfirmed.SheetNames.includes("RendezVous")
        ? "RendezVous"
        : wbConfirmed.SheetNames[0];
      confirmed = xlsx.utils
        .sheet_to_json(wbConfirmed.Sheets[sheetConfirmed])
        .filter(Boolean);
    }

    // Map keys and check for rescheduling
    const appointments = demands.map((row) => {
      // Helper to find value by case-insensitive key
      const getVal = (obj, keyName) => {
        if (!obj || typeof obj !== "object") return null;
        const foundKey = Object.keys(obj).find(
          (k) => k.trim().toLowerCase() === keyName.toLowerCase(),
        );
        return foundKey ? obj[foundKey] : null;
      };

      const demandName = String(getVal(row, "Nom") || "")
        .trim()
        .toLowerCase();
      const demandPhoneFull = String(getVal(row, "Telephone") || "").replace(
        /\D/g,
        "",
      );
      const demandPhone8 = demandPhoneFull.slice(-8);
      const requestedHeure = String(getVal(row, "HeureRDV") || "").trim();

      // Find latest confirmed entry for this patient
      const confirmedEntry = confirmed
        .slice()
        .reverse()
        .find((c) => {
          const confirmedName = String(getVal(c, "Nom") || "")
            .trim()
            .toLowerCase();
          const confirmedPhoneFull = String(
            getVal(c, "Telephone") || "",
          ).replace(/\D/g, "");
          const confirmedPhone8 = confirmedPhoneFull.slice(-8);

          const nameMatch = demandName === confirmedName;
          const phoneMatch = demandPhone8 && demandPhone8 === confirmedPhone8;

          return nameMatch && phoneMatch;
        });

      const confirmedHeure = confirmedEntry
        ? String(getVal(confirmedEntry, "Heure") || "").trim()
        : requestedHeure;

      // It is rescheduled if a confirmation exists and the time is different
      const isRescheduled = !!(
        confirmedEntry &&
        confirmedHeure &&
        confirmedHeure !== requestedHeure
      );

      return {
        id: row["ID"],
        nom: row["Nom"],
        telephone: row["Telephone"],
        email: row["Email"],
        gender: row["Gender"],
        motif: row["Motif"],
        heure: confirmedHeure,
        requestedHeure: requestedHeure,
        statut: row["Statut"],
        date: row["DateDemande"],
        notes: row["Notes"],
        isRescheduled: isRescheduled,
      };
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error reading appointments:", error);
    res.status(500).json({ error: "Erreur lors de la lecture des données." });
  }
});

/**
 * @openapi
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
app.post("/api/submit", (req, res) => {
  try {
    const formData = req.body;
    console.log("Received data:", formData);

    let workbook;
    let data = [];

    if (fs.existsSync(EXCEL_PATH)) {
      workbook = xlsx.readFile(EXCEL_PATH);
      const sheetName = workbook.SheetNames.includes("Demandes")
        ? "Demandes"
        : workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
    } else {
      workbook = xlsx.utils.book_new();
    }

    // Add new entry
    const nextId = `RDV-${(data.length + 1).toString().padStart(3, "0")}`;
    const newEntry = {
      ID: nextId,
      Nom: `${formData.firstName} ${formData.lastName}`,
      Telephone: formData.phone,
      Email: formData.email,
      Gender: formData.gender,
      Motif: formData.reason,
      DateRDV: formData.appointmentDate
        ? formData.appointmentDate.split("-").reverse().join("/")
        : "",
      HeureRDV: formData.appointmentTime,
      Statut: "En attente",
      DateDemande: new Date().toLocaleDateString("fr-FR"),
      Notes: formData.notes || "",
    };

    data.push(newEntry);

    const newWorksheet = xlsx.utils.json_to_sheet(data);

    // Ensure column widths
    newWorksheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
    ];

    // Replace or add the 'Demandes' sheet
    const finalSheetName = "Demandes";
    if (workbook.SheetNames.includes(finalSheetName)) {
      workbook.Sheets[finalSheetName] = newWorksheet;
    } else {
      xlsx.utils.book_append_sheet(workbook, newWorksheet, finalSheetName);
    }

    xlsx.writeFile(workbook, EXCEL_PATH);
    console.log("File successfully saved to:", EXCEL_PATH);

    res.status(200).json({ message: "Données enregistrées avec succès !" });
  } catch (error) {
    console.error("Error writing to Excel:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement des données." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
