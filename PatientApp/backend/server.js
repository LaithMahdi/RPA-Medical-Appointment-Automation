require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
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

app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Received data:', formData);

        const workbook = new ExcelJS.Workbook();
        let worksheet;

        if (fs.existsSync(EXCEL_PATH)) {
            await workbook.xlsx.readFile(EXCEL_PATH);
            worksheet = workbook.getWorksheet('Demandes') || workbook.worksheets[0];
        } else {
            worksheet = workbook.addWorksheet('Demandes');
        }

        // Define columns mapping
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 12 },
            { header: 'Nom', key: 'nom', width: 25 },
            { header: 'Telephone', key: 'telephone', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Gender', key: 'gender', width: 12 },
            { header: 'Motif', key: 'motif', width: 25 },
            { header: 'Statut', key: 'statut', width: 15 },
            { header: 'DateDemande', key: 'date', width: 15 },
            { header: 'Notes', key: 'notes', width: 40 }
        ];

        // Only style headers if it's a new file or headers are missing
        if (worksheet.rowCount === 1 && !worksheet.getRow(1).getCell(1).value) {
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F3D7A' }
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        // Calculate next ID
        const rowCount = worksheet.rowCount;
        console.log('Current row count:', rowCount);
        const id = `RDV-${rowCount.toString().padStart(3, '0')}`;

        // Add the new row
        const newRow = worksheet.addRow({
            id: id,
            nom: `${formData.firstName} ${formData.lastName}`,
            telephone: formData.phone,
            email: formData.email,
            gender: formData.gender,
            motif: formData.reason,
            statut: 'En attente',
            date: new Date().toLocaleDateString('fr-FR'),
            notes: formData.notes || ''
        });
        console.log('Added row with ID:', id);

        // Save the file (preserves existing styles)
        await workbook.xlsx.writeFile(EXCEL_PATH);
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
