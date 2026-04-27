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
        if (fs.existsSync(EXCEL_PATH)) {
            const workbook = xlsx.readFile(EXCEL_PATH);
            const sheetName = workbook.SheetNames.includes('Demandes') ? 'Demandes' : workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            
            // Map keys to match frontend expectations
            const appointments = data.map(row => ({
                id: row['ID'],
                nom: row['Nom'],
                telephone: row['Telephone'],
                email: row['Email'],
                gender: row['Gender'],
                motif: row['Motif'],
                heure: row['HeureRDV'],
                statut: row['Statut'],
                date: row['DateDemande'],
                notes: row['Notes']
            }));
            
            res.json(appointments);
        } else {
            res.json([]);
        }
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
