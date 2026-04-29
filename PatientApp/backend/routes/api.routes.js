const express = require("express");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

function createApiRouter({ excelPath, confirmedPath }) {
  const router = express.Router();

  const dataDir = path.dirname(excelPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  router.post("/login", (req, res) => {
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

  router.get("/appointments", (req, res) => {
    try {
      let demands = [];
      let confirmed = [];

      if (fs.existsSync(excelPath)) {
        const wbDemands = xlsx.readFile(excelPath);
        const sheetDemands = wbDemands.SheetNames.includes("Demandes")
          ? "Demandes"
          : wbDemands.SheetNames[0];
        demands = xlsx.utils
          .sheet_to_json(wbDemands.Sheets[sheetDemands])
          .filter(Boolean);
      }

      if (fs.existsSync(confirmedPath)) {
        const wbConfirmed = xlsx.readFile(confirmedPath);
        const sheetConfirmed = wbConfirmed.SheetNames.includes("RendezVous")
          ? "RendezVous"
          : wbConfirmed.SheetNames[0];
        confirmed = xlsx.utils
          .sheet_to_json(wbConfirmed.Sheets[sheetConfirmed])
          .filter(Boolean);
      }

      const getVal = (obj, keyName) => {
        if (!obj || typeof obj !== "object") return null;
        const foundKey = Object.keys(obj).find(
          (key) => key.trim().toLowerCase() === keyName.toLowerCase(),
        );
        return foundKey ? obj[foundKey] : null;
      };

      const appointments = demands.map((row) => {
        const demandName = String(getVal(row, "Nom") || "")
          .trim()
          .toLowerCase();
        const demandPhoneFull = String(getVal(row, "Telephone") || "").replace(
          /\D/g,
          "",
        );
        const demandPhone8 = demandPhoneFull.slice(-8);
        const requestedHeure = String(getVal(row, "HeureRDV") || "").trim();

        const confirmedEntry = confirmed
          .slice()
          .reverse()
          .find((confirmedRow) => {
            const confirmedName = String(getVal(confirmedRow, "Nom") || "")
              .trim()
              .toLowerCase();
            const confirmedPhoneFull = String(
              getVal(confirmedRow, "Telephone") || "",
            ).replace(/\D/g, "");
            const confirmedPhone8 = confirmedPhoneFull.slice(-8);

            const nameMatch = demandName === confirmedName;
            const phoneMatch = demandPhone8 && demandPhone8 === confirmedPhone8;

            return nameMatch && phoneMatch;
          });

        const confirmedHeure = confirmedEntry
          ? String(getVal(confirmedEntry, "Heure") || "").trim()
          : requestedHeure;

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
          requestedHeure,
          statut: row["Statut"],
          date: row["DateDemande"],
          notes: row["Notes"],
          isRescheduled,
        };
      });

      res.json(appointments);
    } catch (error) {
      console.error("Error reading appointments:", error);
      res.status(500).json({ error: "Erreur lors de la lecture des données." });
    }
  });

  router.post("/submit", (req, res) => {
    try {
      const formData = req.body;
      console.log("Received data:", formData);

      let workbook;
      let data = [];

      if (fs.existsSync(excelPath)) {
        workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames.includes("Demandes")
          ? "Demandes"
          : workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(worksheet);
      } else {
        workbook = xlsx.utils.book_new();
      }

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

      const finalSheetName = "Demandes";
      if (workbook.SheetNames.includes(finalSheetName)) {
        workbook.Sheets[finalSheetName] = newWorksheet;
      } else {
        xlsx.utils.book_append_sheet(workbook, newWorksheet, finalSheetName);
      }

      xlsx.writeFile(workbook, excelPath);
      console.log("File successfully saved to:", excelPath);

      res.status(200).json({ message: "Données enregistrées avec succès !" });
    } catch (error) {
      console.error("Error writing to Excel:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'enregistrement des données." });
    }
  });

  return router;
}

module.exports = createApiRouter;
