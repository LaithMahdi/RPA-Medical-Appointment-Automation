require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const EXCEL_PATH = path.join(__dirname, '../../Data/Demandes_Patients.xlsx');
const CONFIRMED_PATH = path.join(__dirname, '../../Data/RendezVous_Confirmes.xlsx');

// Ensure Data directory exists
const dataDir = path.dirname(EXCEL_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.DOCTOR_EMAIL && password === process.env.DOCTOR_PASSWORD) {
        return res.json({ success: true, user: 'Doctor', role: 'doctor' });
    }

    if (email === process.env.SECRETARY_EMAIL && password === process.env.SECRETARY_PASSWORD) {
        return res.json({ success: true, user: 'Secretaire', role: 'secretary' });
    }

    res.status(401).json({ success: false, message: 'Identifiants invalides' });
});

// Get Appointments Endpoint (Agenda)
app.get('/api/appointments', (req, res) => {
    try {
        let demands = [];
        let confirmed = [];

        if (fs.existsSync(EXCEL_PATH)) {
            const wbDemands = xlsx.readFile(EXCEL_PATH);
            const sheetDemands = wbDemands.SheetNames.includes('Demandes') ? 'Demandes' : wbDemands.SheetNames[0];
            demands = xlsx.utils.sheet_to_json(wbDemands.Sheets[sheetDemands]).filter(Boolean);
        }

        if (fs.existsSync(CONFIRMED_PATH)) {
            const wbConfirmed = xlsx.readFile(CONFIRMED_PATH);
            const sheetConfirmed = wbConfirmed.SheetNames.includes('RendezVous') ? 'RendezVous' : wbConfirmed.SheetNames[0];
            confirmed = xlsx.utils.sheet_to_json(wbConfirmed.Sheets[sheetConfirmed]).filter(Boolean);
        }

        // Map keys and check for rescheduling
        const appointments = demands.map(row => {
            // Helper to find value by case-insensitive key
            const getVal = (obj, keyName) => {
                if (!obj || typeof obj !== 'object') return null;
                const foundKey = Object.keys(obj).find(k => k.trim().toLowerCase() === keyName.toLowerCase());
                return foundKey ? obj[foundKey] : null;
            };

            const demandName = String(getVal(row, 'Nom') || '').trim().toLowerCase();
            const demandPhoneFull = String(getVal(row, 'Telephone') || '').replace(/\D/g, '');
            const demandPhone8 = demandPhoneFull.slice(-8);
            const requestedHeure = String(getVal(row, 'HeureRDV') || '').trim();

            // Find latest confirmed entry for this patient
            const confirmedEntry = confirmed.slice().reverse().find(c => {
                const confirmedName = String(getVal(c, 'Nom') || '').trim().toLowerCase();
                const confirmedPhoneFull = String(getVal(c, 'Telephone') || '').replace(/\D/g, '');
                const confirmedPhone8 = confirmedPhoneFull.slice(-8);

                const nameMatch = demandName === confirmedName;
                const phoneMatch = demandPhone8 && demandPhone8 === confirmedPhone8;

                return nameMatch && phoneMatch;
            });

            const confirmedHeure = confirmedEntry
                ? String(getVal(confirmedEntry, 'Heure') || '').trim()
                : requestedHeure;

            // It is rescheduled if a confirmation exists and the time is different
            const isRescheduled = !!(confirmedEntry && confirmedHeure && confirmedHeure !== requestedHeure);

            return {
                id: row['ID'],
                nom: row['Nom'],
                telephone: row['Telephone'],
                email: row['Email'],
                gender: row['Gender'],
                motif: row['Motif'],
                heure: confirmedHeure,
                requestedHeure: requestedHeure,
                statut: row['Statut'],
                date: row['DateDemande'],
                notes: row['Notes'],
                isRescheduled: isRescheduled
            };
        });

        res.json(appointments);
    } catch (error) {
        console.error('Error reading appointments:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des données.' });
    }
});

app.post('/api/submit', (req, res) => {
    try {
        const formData = req.body;
        console.log('Received data:', formData);

        let workbook;
        let data = [];

        if (fs.existsSync(EXCEL_PATH)) {
            workbook = xlsx.readFile(EXCEL_PATH);
            const sheetName = workbook.SheetNames.includes('Demandes') ? 'Demandes' : workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(worksheet);
        } else {
            workbook = xlsx.utils.book_new();
        }

        // Add new entry
        const nextId = `RDV-${(data.length + 1).toString().padStart(3, '0')}`;
        const newEntry = {
            'ID': nextId,
            'Nom': `${formData.firstName} ${formData.lastName}`,
            'Telephone': formData.phone,
            'Email': formData.email,
            'Gender': formData.gender,
            'Motif': formData.reason,
            'DateRDV': formData.appointmentDate ? formData.appointmentDate.split('-').reverse().join('/') : '',
            'HeureRDV': formData.appointmentTime,
            'Statut': 'En attente',
            'DateDemande': new Date().toLocaleDateString('fr-FR'),
            'Notes': formData.notes || ''
        };

        data.push(newEntry);

        const newWorksheet = xlsx.utils.json_to_sheet(data);

        // Ensure column widths
        newWorksheet['!cols'] = [
            { wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
            { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }
        ];

        // Replace or add the 'Demandes' sheet
        const finalSheetName = 'Demandes';
        if (workbook.SheetNames.includes(finalSheetName)) {
            workbook.Sheets[finalSheetName] = newWorksheet;
        } else {
            xlsx.utils.book_append_sheet(workbook, newWorksheet, finalSheetName);
        }

        xlsx.writeFile(workbook, EXCEL_PATH);
        console.log('File successfully saved to:', EXCEL_PATH);

        res.status(200).json({ message: 'Données enregistrées avec succès !' });
    } catch (error) {
        console.error('Error writing to Excel:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement des données.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
