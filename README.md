# 🩺 RPA · Gestion Automatisée des Rendez-vous Médicaux

> **Système complet** combinant un robot UiPath, une application web React et un backend Node.js pour automatiser le cycle de vie des rendez-vous dans un cabinet médical.

[![UiPath](https://img.shields.io/badge/UiPath-Studio-F67200?style=for-the-badge&logo=uipath&logoColor=white)](https://www.uipath.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Excel](https://img.shields.io/badge/Data-Excel%20Workbook-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/en-us/microsoft-365/excel)
[![SMTP](https://img.shields.io/badge/Email-Gmail%20SMTP-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://support.google.com/mail/answer/7126229)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Architecture Globale du Système](#-architecture-globale-du-système)
3. [PatientApp — Application Web](#-patientapp--application-web)
4. [Robot UiPath — Processus Automatisé](#-robot-uipath--processus-automatisé)
5. [Gestion des Conflits & Reprogrammation](#-gestion-des-conflits--reprogrammation)
6. [Structure des Données (Fichiers Excel)](#-structure-des-données-fichiers-excel)
7. [Description des Workflows UiPath](#-description-des-workflows-uipath)
8. [Flux d'Exécution](#-flux-dexécution)
9. [Configuration SMTP](#-configuration-smtp--email)
10. [Prérequis & Installation](#-prérequis--installation)
11. [Paramétrage de Config.xlsx](#-paramétrage-de-configxlsx)
12. [Auteur](#-auteur)

---

## 🌟 Vue d'Ensemble

Ce projet est une solution **RPA (Robotic Process Automation)** combinant :

- Un **formulaire web React** pour que les patients puissent soumettre leurs demandes de rendez-vous
- Un **backend Node.js/Express** qui enregistre les demandes dans Excel et expose une API pour le tableau de bord
- Un **robot UiPath** qui traite les demandes automatiquement : vérification de l'agenda, confirmation ou reprogrammation, mise à jour des fichiers et envoi d'emails

### Problème Résolu

| Avant (Manuel) | Après (RPA) |
|---|---|
| Vérification manuelle de l'agenda | ✅ Scan automatique des créneaux |
| Risque de double réservation | ✅ Détection de conflits + reprogrammation |
| Appels téléphoniques de confirmation | ✅ Email HTML automatique personnalisé |
| Aucune traçabilité | ✅ Log d'exécution complet dans Excel |
| Pas de portail patient | ✅ Application web moderne avec tableau de bord |

---

## 🏗️ Architecture Globale du Système

```
┌─────────────────────────────────────────────────────────────────┐
│                        PATIENT (navigateur)                      │
│              http://localhost:5173  (React Frontend)             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ POST /api/submit
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js / Express)                    │
│                   http://localhost:8080                          │
│                                                                  │
│  POST /api/submit    → Écrit dans Demandes_Patients.xlsx        │
│  GET  /api/appointments → Lit Demandes + RendezVous_Confirmes   │
│  POST /api/login     → Authentification Médecin / Secrétaire    │
└──────────────┬───────────────────────────────────────────────── ┘
               │ écrit/lit
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FICHIERS EXCEL (Data/)                         │
│                                                                  │
│  Demandes_Patients.xlsx    ← input des demandes patients        │
│  Agenda_Medecin.xlsx       ← état des créneaux du médecin       │
│  RendezVous_Confirmes.xlsx ← output confirmé par le robot       │
│  Config.xlsx               ← paramètres globaux du robot        │
└──────────────┬──────────────────────────────────────────────────┘
               │ lit/écrit
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ROBOT UIPATH (Main.xaml)                    │
│                                                                  │
│  1. InitAllSettings        → Charge Config.xlsx                 │
│  2. LireDemandesExcel      → Lit le 1er patient "En attente"    │
│  3. VerifierDisponibilite  → Cherche créneau + détecte conflit  │
│  4. EnregistrerRDVExcel    → Écrit dans RendezVous_Confirmes    │
│  5. MettreAJourAgenda      → Marque créneau "Occupé"            │
│  6. EnvoyerNotification    → Email confirmation ou reprog.      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 PatientApp — Application Web

L'application web est divisée en deux parties :

### Backend (`PatientApp/backend/`)

Construit avec **Node.js + Express**. Il utilise la librairie `xlsx` pour lire/écrire les fichiers Excel.

**Variables d'environnement (`.env`)** :
```env
DOCTOR_EMAIL=medecin@example.com
DOCTOR_PASSWORD=motdepasse_medecin
SECRETARY_EMAIL=secretaire@example.com
SECRETARY_PASSWORD=motdepasse_secretaire
PORT=8080
```

**Endpoints API** :

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/login` | Authentification médecin/secrétaire |
| `GET` | `/api/appointments` | Liste des rendez-vous avec détection de reprogrammation |
| `POST` | `/api/submit` | Enregistre une nouvelle demande patient dans Excel |
| `GET` | `/api/debug-confirmed` | Debug : contenu brut de `RendezVous_Confirmes.xlsx` |

**Logique de correspondance (`/api/appointments`)** :

Le backend croise deux fichiers Excel pour détecter si un patient a été reprogrammé :

1. Lit `Demandes_Patients.xlsx` (les demandes originales)
2. Lit `RendezVous_Confirmes.xlsx` (les confirmations du robot)
3. Pour chaque demande, il cherche l'entrée correspondante dans les confirmations par :
   - **Nom** (insensible à la casse)
   - **Téléphone** (8 derniers chiffres, insensible au format)
4. Si une correspondance est trouvée avec une **heure différente** → `isRescheduled: true`

```js
// Exemple de réponse enrichie
{
  "nom": "Yassine Mahdi",
  "heure": "10:00",           // heure confirmée par le robot
  "requestedHeure": "09:30",  // heure demandée par le patient
  "isRescheduled": true       // le créneau a été changé
}
```

**Lancement** :
```bash
cd PatientApp/backend
bun run dev   # ou: npm run dev
```

---

### Frontend (`PatientApp/frontend/`)

Construit avec **React + Vite**. Il permet aux patients de soumettre des demandes et au médecin/secrétaire de visualiser le tableau de bord.

**Pages principales** :

| Page | Route | Description |
|---|---|---|
| Formulaire Patient | `/` | Formulaire de demande de rendez-vous |
| Login | `/login` | Authentification Médecin / Secrétaire |
| Agenda | `/agenda` | Tableau de bord des rendez-vous |

**Variable d'environnement** :
```env
VITE_API_URL=http://localhost:8080/api
```

**Fonctionnalités du tableau de bord (`Agenda`)** :
- 🔍 Recherche par nom ou ID
- 🔖 Filtrage par statut (`Tous`, `En attente`, `Traité`)
- 🔄 Badge **Reprogrammé** en orange si le robot a changé l'heure
- ~~Heure barrée~~ affichée quand un créneau a été modifié
- 📊 Statistiques en temps réel (total, en attente, traité)

**Lancement** :
```bash
cd PatientApp/frontend
npm run dev
```

---

## 🤖 Robot UiPath — Processus Automatisé

Le robot traite les demandes en attente dans `Demandes_Patients.xlsx` et gère automatiquement les conflits.

### Déclenchement

Le robot lit uniquement la **première demande** avec le statut `En attente`. Il est conçu pour être exécuté une fois par demande (ex: planifié toutes les 5 minutes via UiPath Orchestrator ou déclenché manuellement).

### Variables Principales dans `Main.xaml`

| Variable | Type | Description |
|---|---|---|
| `Config` | `Dictionary(String, Object)` | Paramètres chargés depuis Config.xlsx |
| `PatientNom` | `String` | Nom complet du patient |
| `PatientTelephone` | `String` | Numéro de téléphone |
| `PatientEmail` | `String` | Email du patient |
| `PatientMotif` | `String` | Motif de consultation |
| `HeureDemande` | `String` | Heure souhaitée par le patient |
| `DateRDV` | `String` | Date du rendez-vous confirmé |
| `HeureRDV` | `String` | Heure du rendez-vous confirmé |
| `IsRescheduled` | `Boolean` | `True` si reprogrammation nécessaire |
| `DisponibiliteTrouvee` | `Boolean` | `True` si un créneau est disponible |
| `TransactionStatus` | `String` | `SUCCESS` / `NO_SLOT` |

---

## 🔄 Gestion des Conflits & Reprogrammation

C'est la **fonctionnalité principale** ajoutée dans cette version. Le robot gère le cas où deux patients demandent le même créneau.

### Scénario de Conflit

```
Demande 1 — Laith Mahdi      → 09:30  → CONFIRMÉ  ✅
Demande 2 — Yassine Mahdi    → 09:30  → OCCUPÉ → reprogrammé à 10:00 🔄
```

### Logique dans `VerifierDisponibiliteAgenda.xaml`

1. Le workflow reçoit `in_HeureSouhaitee` (l'heure demandée par le patient)
2. Il scanne `Agenda_Medecin.xlsx` pour trouver le **premier créneau `Libre`**
3. Si le créneau trouvé est **différent** de l'heure demandée → `out_IsRescheduled = True`
4. L'heure confirmée (`out_HeureRDV`) est toujours le premier créneau réellement disponible

### Emails Différenciés

Le workflow `EnvoyerNotificationPatient.xaml` envoie deux types d'emails selon le résultat :

| Cas | Template | Couleur |
|---|---|---|
| Créneau confirmé tel que demandé | Confirmation | 🔵 Bleu |
| Créneau reprogrammé | Reprogrammation | 🟠 Orange |

L'email de reprogrammation indique explicitement :
- L'heure demandée originale
- Le nouveau créneau attribué
- Un message d'excuse et d'explication

### Mise à Jour de l'Agenda (`MettreAJourAgenda.xaml`)

Après chaque confirmation, le robot marque le créneau comme **`Occupé`** dans `Agenda_Medecin.xlsx` via :

1. Lecture de l'agenda dans un `DataTable`
2. Boucle `ForEach` sur les lignes pour trouver la correspondance `Date + Heure`
3. Modification de la colonne `Statut` → `"Occupé"`
4. Réécriture du `DataTable` complet dans le fichier Excel

---

## 📊 Structure des Données (Fichiers Excel)

### `Demandes_Patients.xlsx` — Feuille `Demandes`

| Colonne | Description |
|---|---|
| `ID` | Identifiant unique (ex: `RDV-001`) |
| `Nom` | Nom complet du patient |
| `Telephone` | Numéro de contact |
| `Email` | Adresse email |
| `Gender` | Genre (`Masculin` / `Féminin`) |
| `Motif` | Motif de consultation |
| `DateRDV` | Date souhaitée (format `JJ/MM/AAAA`) |
| `HeureRDV` | Heure souhaitée (format `HH:MM`) |
| `Statut` | `En attente` → `Traité` (mis à jour par le robot) |
| `DateDemande` | Date de soumission de la demande |
| `Notes` | Notes additionnelles |

### `Agenda_Medecin.xlsx` — Feuille `Agenda`

| Colonne | Description |
|---|---|
| `Date` | Date du créneau (format `JJ/MM/AAAA`) |
| `Heure` | Heure du créneau (ex: `09:30`) |
| `Statut` | `Libre` / `Occupé` |
| `Patient` | Nom du patient réservant |

### `RendezVous_Confirmes.xlsx` — Feuille `RendezVous`

Fichier écrit par le robot après chaque confirmation. Utilisé par le backend pour la détection de reprogrammation.

| Colonne | Description |
|---|---|
| `Nom` | Nom du patient |
| `Telephone` | Téléphone du patient |
| `Motif` | Motif de consultation |
| `Date` | Date du rendez-vous confirmé |
| `Heure` | Heure du rendez-vous **réellement attribué** |
| `Statut` | Timestamp de confirmation |

### `Config.xlsx` — Feuille `Config`

| Clé | Exemple de Valeur | Description |
|---|---|---|
| `ExcelDemandesPath` | `Data\Demandes_Patients.xlsx` | Fichier des demandes |
| `ExcelAgendaPath` | `Data\Agenda_Medecin.xlsx` | Agenda du médecin |
| `ExcelRDVPath` | `Data\RendezVous_Confirmes.xlsx` | Fichier des RDV confirmés |
| `EmailCabinet` | `votre@gmail.com` | Adresse Gmail expéditrice |
| `SmtpPassword` | `xxxx xxxx xxxx xxxx` | Mot de passe d'application |
| `SmtpServeur` | `smtp.gmail.com` | Serveur SMTP |
| `SmtpPort` | `587` | Port TLS |
| `NomMedecin` | `Dr. Nom Prénom` | Affiché dans les emails |
| `NomCabinet` | `Cabinet Médical ...` | Nom du cabinet |

---

## 🧩 Description des Workflows UiPath

### `Main.xaml` — Chef d'Orchestre

Point d'entrée. Orchestre tous les sous-workflows, gère les variables partagées et définit le `TransactionStatus` final.

### `InitAllSettings.xaml`

Charge `Config.xlsx` et retourne un dictionnaire `Dictionary(String, Object)` avec tous les paramètres.

### `LireDemandesExcel.xaml`

Lit la **première ligne** avec le statut `En attente` dans `Demandes_Patients.xlsx`.

**Nouveauté** : retourne aussi `out_HeureDemande` (l'heure souhaitée par le patient) pour la comparaison de conflit.

### `VerifierDisponibiliteAgenda.xaml`

Scanne `Agenda_Medecin.xlsx` pour trouver le premier créneau `Libre`.

**Nouveauté** : compare le créneau trouvé avec `in_HeureSouhaitee` et met `out_IsRescheduled = True` si différent.

### `EnregistrerRDVExcel.xaml`

Ajoute une nouvelle ligne dans `RendezVous_Confirmes.xlsx` avec les détails du rendez-vous confirmé.

### `MettreAJourAgenda.xaml`

Met à jour le statut du créneau dans `Agenda_Medecin.xlsx` de `Libre` → `Occupé`.

**Nouveauté** : implémentation complète avec lecture, boucle `ForEach`, modification et réécriture du fichier.

### `EnvoyerNotificationPatient.xaml`

Envoie un email HTML via SMTP Gmail.

**Nouveauté** : deux templates dynamiques :
- **Bleu** → confirmation directe
- **Orange** → reprogrammation avec explication

### `NotifierSecretaire.xaml`

Envoie une alerte email à la secrétaire si aucun créneau n'est disponible.

---

## 🔄 Flux d'Exécution

```
Patient soumet formulaire
         │
         ▼ POST /api/submit
Backend écrit dans Demandes_Patients.xlsx (Statut: "En attente")
         │
         ▼ Robot UiPath déclenché
1. InitAllSettings   → charge Config.xlsx
2. LireDemandesExcel → lit patient + heure souhaitée
         │
         ▼
3. VerifierDisponibilite
   ├── Créneau libre trouvé ?
   │        │
   │   OUI  ├── Heure = heure demandée ? → IsRescheduled = False
   │        └── Heure ≠ heure demandée ? → IsRescheduled = True
   │
   └── NON → NotifierSecretaire → TransactionStatus = "NO_SLOT"
         │
         ▼ (si créneau trouvé)
4. EnregistrerRDVExcel   → écrit dans RendezVous_Confirmes.xlsx
5. MettreAJourAgenda     → marque créneau "Occupé"
6. EnvoyerNotification
   ├── IsRescheduled = False → Email bleu (Confirmation)
   └── IsRescheduled = True  → Email orange (Reprogrammation)
         │
         ▼
TransactionStatus = "SUCCESS"
Statut patient mis à jour → "Traité"
```

---

## 📧 Configuration SMTP / Email

Le robot utilise **SMTP avec TLS** via Gmail.

### Obtenir un Mot de Passe d'Application Google

1. Aller sur [myaccount.google.com](https://myaccount.google.com)
2. **Sécurité** → Activer la **Validation en deux étapes**
3. **Sécurité** → **Mots de passe des applications**
4. Créer un mot de passe pour `UiPath RDV Robot`
5. Coller le mot de passe de 16 caractères dans `Config.xlsx` → clé `SmtpPassword`

---

## ⚙️ Prérequis & Installation

### Robot UiPath

| Composant | Version |
|---|---|
| UiPath Studio | 2022.10+ (Windows / .NET 6+) |
| `UiPath.Excel.Activities` | >= 2.16.0 |
| `UiPath.Mail.Activities` | >= 1.16.0 |
| `UiPath.System.Activities` | >= 22.10.0 |

```bash
# Ouvrir UiPath Studio
# File → Open → Sélectionner le dossier mini-project-rpa/
# Configurer Data/Config.xlsx
# Lancer Main.xaml avec F5
```

### Backend

```bash
cd PatientApp/backend
npm install       # ou: bun install
npm run dev       # démarre sur http://localhost:8080
```

### Frontend

```bash
cd PatientApp/frontend
npm install
npm run dev       # démarre sur http://localhost:5173
```

---

## 🔧 Paramétrage de Config.xlsx

```
┌─────────────────────────┬────────────────────────────────────┐
│ Clé                     │ Valeur                             │
├─────────────────────────┼────────────────────────────────────┤
│ ExcelDemandesPath       │ Data\Demandes_Patients.xlsx        │
│ ExcelAgendaPath         │ Data\Agenda_Medecin.xlsx           │
│ ExcelRDVPath            │ Data\RendezVous_Confirmes.xlsx     │
│ EmailCabinet            │ votre.cabinet@gmail.com            │
│ SmtpPassword            │ abcd efgh ijkl mnop                │
│ SmtpServeur             │ smtp.gmail.com                     │
│ SmtpPort                │ 587                                │
│ NomMedecin              │ Dr. Nom Prénom                     │
│ NomCabinet              │ Cabinet Médical Mon Cabinet        │
└─────────────────────────┴────────────────────────────────────┘
```

> ⚠️ **Ne committez jamais `Config.xlsx` avec vos vraies credentials dans un dépôt public.**

---

## 📁 Structure du Projet

```
mini-project-rpa/
│
├── 📄 Main.xaml
├── 📄 project.json
│
├── 📂 Workflows/
│   ├── InitAllSettings.xaml
│   ├── LireDemandesExcel.xaml
│   ├── VerifierDisponibiliteAgenda.xaml
│   ├── EnregistrerRDVExcel.xaml
│   ├── MettreAJourAgenda.xaml
│   ├── EnvoyerNotificationPatient.xaml
│   └── NotifierSecretaire.xaml
│
├── 📂 Data/
│   ├── Config.xlsx
│   ├── Demandes_Patients.xlsx
│   ├── Agenda_Medecin.xlsx
│   ├── RendezVous_Confirmes.xlsx
│   └── Log_Robot.xlsx
│
└── 📂 PatientApp/
    ├── 📂 backend/
    │   ├── server.js          ← API Express + lecture Excel
    │   ├── .env               ← Credentials (non commité)
    │   └── package.json
    └── 📂 frontend/
        ├── src/
        │   ├── components/
        │   │   ├── Agenda.jsx           ← Tableau de bord
        │   │   ├── PatientForm.jsx      ← Formulaire patient
        │   │   └── agenda/
        │   │       ├── AppointmentCard.jsx  ← Carte RDV + badge reprogrammé
        │   │       ├── AgendaHeader.jsx
        │   │       ├── AgendaStats.jsx
        │   │       └── AgendaControls.jsx
        │   └── App.jsx
        └── package.json
```

---

## 👤 Auteur

**Développé par LAITH MAHDI & DALEL LOUSSAIEF**  
📧 Contact : [mahdilaith08@gmail.com](mailto:mahdilaith08@gmail.com)

---

*Projet réalisé dans le cadre d'un mini-projet RPA — UiPath Studio, React, Node.js, Excel Automation, SMTP Gmail.*