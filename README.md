# 🩺 RPA · Gestion Automatisée des Rendez-vous Médicaux

> **Robot UiPath** pour l'automatisation complète du cycle de vie des rendez-vous dans un cabinet médical — de la réception de la demande patient jusqu'à la confirmation par email, en passant par la vérification de l'agenda et la mise à jour des fichiers.

[![UiPath](https://img.shields.io/badge/UiPath-Studio-F67200?style=for-the-badge&logo=uipath&logoColor=white)](https://www.uipath.com/)
[![VB.NET](https://img.shields.io/badge/Language-VB.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/visual-basic/)
[![Excel](https://img.shields.io/badge/Data-Excel%20Workbook-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/en-us/microsoft-365/excel)
[![SMTP](https://img.shields.io/badge/Email-Gmail%20SMTP-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://support.google.com/mail/answer/7126229)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Scénario Réel : Avant & Après le RPA](#-scénario-réel--avant--après-le-rpa)
3. [Analyse du Gain de Temps](#-analyse-du-gain-de-temps)
4. [Fonctionnalités](#-fonctionnalités)
5. [Architecture du Projet](#-architecture-du-projet)
6. [Flux d'Exécution](#-flux-dexécution)
7. [Description des Workflows](#-description-des-workflows)
8. [Structure des Données](#-structure-des-données)
9. [Configuration SMTP](#-configuration-smtp--email)
10. [Gestion des Erreurs & Robustesse](#-gestion-des-erreurs--robustesse)
11. [Prérequis & Installation](#-prérequis--installation)
12. [Paramétrage de Config.xlsx](#-paramétrage-de-configxlsx)
13. [Exécution & Logs](#-exécution--logs)
14. [Auteur](#-auteur)

---

## 🌟 Vue d'Ensemble

Ce projet est une solution **RPA (Robotic Process Automation)** développée avec **UiPath Studio** pour digitaliser et automatiser entièrement le processus de prise de rendez-vous médicaux. Il élimine les tâches manuelles répétitives de la secrétaire médicale : vérification de l'agenda, enregistrement des patients, et envoi de confirmations.

### Problème Résolu

| Avant (Manuel) | Après (RPA) |
|---|---|
| Vérification manuelle de l'agenda | ✅ Scan automatique du premier créneau libre |
| Appels téléphoniques de confirmation | ✅ Email automatique personnalisé |
| Risque de double réservation | ✅ Mise à jour atomique de l'agenda |
| Aucune traçabilité | ✅ Log d'exécution complet dans Excel |
| Dépendant d'une présence humaine | ✅ Fonctionne 24h/24 sans intervention |

---

## 🎭 Scénario Réel : Avant & Après le RPA

> Les deux scénarios ci-dessous décrivent **la même journée** dans le même cabinet médical — une fois vécue par la secrétaire Yasmine sans RPA, et une fois avec le robot actif.

---

### 👥 Personnages

| Personnage | Rôle |
|---|---|
| **Yasmine** | Secrétaire médicale du cabinet |
| **Dr. Karim Benali** | Médecin généraliste |
| **M. Tariq Mansouri** | Patient souhaitant un rendez-vous |
| **🤖 RPA Robot** | Le robot UiPath (dans le scénario "Avec RPA") |

---

### ❌ SCÉNARIO 1 — Processus Manuel (Sans RPA)

> 📅 **Lundi matin, 08h47** — Le cabinet ouvre. Le téléphone sonne déjà.

**08h47** — M. Mansouri appelle le cabinet.

> 🧑 *"Bonjour, je voudrais prendre un rendez-vous avec le Dr. Benali pour une consultation générale."*

**08h48** — Yasmine décroche, pose son café, et ouvre le classeur Excel de l'agenda sur son ordinateur.

> 👩 *"Bien sûr monsieur, un instant s'il vous plaît..."*

Elle fait défiler manuellement les lignes de l'agenda Excel, ligne par ligne, cherchant visuellement une cellule marquée "Libre".

```
[Yasmine scrolle l'agenda Excel...]
Lundi    09:00  → Réservé  (M. Hamidi)
Lundi    09:30  → Réservé  (Mme. Saidi)
Lundi    10:00  → Réservé  (M. Bouazza)
Lundi    10:30  → Réservé  (Mme. Tlili)
Lundi    11:00  → Libre    ← trouvé après 3 minutes de recherche
```

**08h51** — Yasmine trouve enfin un créneau.

> 👩 *"J'ai un créneau disponible lundi à 11h00, ça vous convient ?"*
> 🧑 *"Oui parfait !"*

**08h52** — Yasmine doit maintenant accomplir 5 tâches manuelles :

1. Ouvrir un **second fichier Excel** (liste des patients) et ajouter manuellement une nouvelle ligne
2. Retourner sur l'agenda et **modifier manuellement** la cellule 11h00 → `"Réservé – Mansouri"`
3. Raccrocher, puis ouvrir Gmail et rédiger un **email de confirmation à la main**
4. Copier-coller le nom, la date, l'heure dans le corps du message
5. Envoyer l'email, puis mettre à jour le registre des logs

**09h04** — Transaction terminée. **Durée totale : ~17 minutes.**

> ⚠️ **Problème 1** : Pendant ce temps, 2 autres patients ont appelé et sont tombés sur le répondeur.
> ⚠️ **Problème 2** : Yasmine a oublié de remplir le fichier `Execution_Log.xlsx` — aucune traçabilité.
> ⚠️ **Problème 3** : Un collègue a ouvert l'agenda Excel en même temps → conflit de version, les modifications de Yasmine sont écrasées.
> ⚠️ **Problème 4** : Une faute de frappe dans le nom du patient → l'email part avec "Mansori" au lieu de "Mansouri".

---

### ✅ SCÉNARIO 2 — Processus Automatisé (Avec RPA)

> 📅 **Lundi matin, 08h47** — M. Mansouri soumet sa demande via le formulaire. Elle est enregistrée automatiquement dans `Demandes_Patients.xlsx`.

**08h47:00** — La demande entre dans `Demandes_Patients.xlsx`. Le robot détecte la nouvelle ligne.

**08h47:03** — Le robot UiPath se déclenche.

```
[RPA-RDV] === Démarrage du processus de prise de rendez-vous médical ===
[RPA-RDV] ÉTAPE 1 : Lecture du fichier Excel des demandes
  → Patient détecté : Tariq Mansouri | Motif : Consultation générale
[RPA-RDV] ÉTAPE 2 : Consultation de l'agenda du médecin
  → Scan de l'agenda en cours...
  → Créneau libre trouvé : Lundi 02 Juin 2025 à 11:00 ✓
[RPA-RDV] ÉTAPE 3 : Enregistrement du rendez-vous dans Excel
  → Nouvelle ligne ajoutée dans Historique_Patients.xlsx ✓
[RPA-RDV] ÉTAPE 4 : Mise à jour de l'agenda du médecin
  → Cellule Lundi 11:00 → "Réservé – Mansouri" ✓
[RPA-RDV] ÉTAPE 5 : Envoi de la confirmation au patient
  → Email envoyé à tariq.mansouri@email.com ✓
[RPA-RDV] ✅ Rendez-vous CONFIRMÉ pour Tariq Mansouri le 02/06/2025 à 11:00
[RPA-RDV] === Processus terminé. Statut : SUCCESS ===
```

**08h47:45** — M. Mansouri reçoit cet email dans sa boîte de réception :

```
────────────────────────────────────────────────────────
De      : Cabinet Médical Dr. Benali <cabinet@gmail.com>
À       : tariq.mansouri@email.com
Objet   : ✅ Confirmation de votre rendez-vous médical
────────────────────────────────────────────────────────

Bonjour M. Mansouri,

Votre rendez-vous avec le Dr. Karim Benali est confirmé :

  📅 Date  : Lundi 02 Juin 2025
  🕐 Heure : 11h00
  📍 Lieu  : Cabinet Médical, 14 Rue Ibn Khaldoun, Tunis

Merci de vous présenter 5 minutes avant l'heure prévue.
Veuillez apporter votre carnet de santé et votre pièce d'identité.

Cordialement,
Cabinet Médical Dr. Benali
────────────────────────────────────────────────────────
```

**08h47:45** — Transaction 100% terminée. **Durée totale : 45 secondes.**

> ✅ Yasmine n'a **rien eu à faire** — elle accueillait le premier patient du matin.
> ✅ L'agenda est mis à jour **sans aucun conflit** de fichier.
> ✅ Le log est **automatiquement renseigné** dans `Execution_Log.xlsx` avec horodatage.
> ✅ Zéro faute de frappe — les données viennent directement du formulaire patient.

---

### 🚨 Cas Limite — Agenda Entièrement Plein

> Que se passe-t-il si **tous les créneaux du Dr. Benali sont réservés** ?

**Sans RPA** : Yasmine rappelle le patient, s'excuse, cherche un autre créneau à la main, propose un autre jour... temps perdu, patient potentiellement mécontent.

**Avec RPA** :

```
[RPA-RDV] ÉTAPE 2 : Consultation de l'agenda du médecin
  → Scan complet de l'agenda...
  → ⚠️ Aucun créneau disponible cette semaine
[RPA-RDV] ⚠️ Aucun créneau disponible – Notification secrétaire requise
  → Email d'alerte envoyé à yasmine@cabinet.com ✓
  → TransactionStatus = NO_SLOT
[RPA-RDV] === Processus terminé. Statut : NO_SLOT ===
```

Yasmine reçoit une alerte instantanée avec le nom du patient et son motif, et peut rappeler **proactivement** pour proposer une alternative — sans avoir perdu de temps à fouiller l'agenda.

---

## ⏱️ Analyse du Gain de Temps

### Par Transaction (1 Rendez-vous)

| Étape du Processus | ❌ Manuel (Yasmine) | ✅ Avec RPA | ⚡ Gain |
|---|---|---|---|
| Réception et lecture de la demande | 2 min | 3 sec | **-1 min 57 sec** |
| Recherche créneau dans l'agenda | 3 min | 8 sec | **-2 min 52 sec** |
| Enregistrement dans la liste patients | 2 min | 5 sec | **-1 min 55 sec** |
| Mise à jour de l'agenda | 1 min | 4 sec | **-56 sec** |
| Rédaction et envoi email confirmation | 4 min | 6 sec | **-3 min 54 sec** |
| Mise à jour du log d'exécution | 3 min | 2 sec | **-2 min 58 sec** |
| **TOTAL** | **~15–17 min** | **~28–45 sec** | **🏆 Réduction de ~96%** |

---

### Sur une Semaine Typique (Cabinet Moyen = 40 demandes/semaine)

| Métrique | ❌ Sans RPA | ✅ Avec RPA |
|---|---|---|
| Demandes traitées/semaine | 40 | 40 |
| Temps moyen par demande | 16 min | 40 sec |
| **Temps total consacré/semaine** | **~640 min (10h40)** | **~27 min** |
| **Temps libéré pour Yasmine** | — | **🏆 +613 min = +10h13/semaine** |
| Erreurs de saisie estimées | 3 à 5 / semaine | **0** |
| Doubles réservations accidentelles | 1 à 2 / mois | **0** |
| Disponibilité du traitement | Heures d'ouverture uniquement | **24h/24 — 7j/7** |
| Réponse au patient | 15 à 60 min | **< 1 minute** |

---

### Sur une Année Complète

```
10h13 libérées par semaine × 52 semaines
= 531 heures économisées par an
= 66 journées de travail de 8h récupérées
  pour un seul cabinet médical.
```

| Indicateur Annuel | Valeur Estimée |
|---|---|
| ⏰ Temps secrétaire libéré | **~531 heures/an** |
| 📅 Équivalent en jours ouvrés | **~66 jours ouvrés** |
| ❌ Erreurs de saisie évitées | **~200 erreurs/an** |
| 📧 Emails de confirmation envoyés | **~2 000 emails automatiques** |
| 🔔 Alertes "agenda plein" gérées | **~50 alertes proactives** |
| 💰 Coût humain évité (estimé à 15€/h) | **~7 965 €/an** |

---

### Ce que Yasmine Fait Maintenant avec ce Temps Récupéré

Le robot prend en charge toutes les tâches répétitives et sans valeur ajoutée. Yasmine peut enfin se concentrer sur ce qui compte vraiment :

| Avant le RPA ❌ | Après le RPA ✅ |
|---|---|
| Passer des appels de confirmation | Accueillir les patients avec attention |
| Copier-coller des données entre fichiers | Préparer les dossiers médicaux en amont |
| Chercher manuellement dans l'agenda | Gérer les renouvellements d'ordonnances |
| Rédiger des emails répétitifs | Traiter les cas complexes et urgents |
| Corriger des erreurs de saisie | Assurer le suivi des patients chroniques |

> *"Le robot fait le travail répétitif. Yasmine fait le travail humain."*

---

## ✨ Fonctionnalités

- 📥 **Lecture automatique** des demandes patients depuis un fichier Excel dédié
- 🗓️ **Vérification intelligente** du premier créneau disponible dans l'agenda du médecin
- 💾 **Enregistrement sécurisé** du RDV dans le fichier historique patients
- 🔄 **Mise à jour en temps réel** de l'agenda du médecin (créneau marqué "Réservé")
- 📧 **Envoi automatique** d'un email de confirmation personnalisé au patient
- 🔔 **Alerte secrétaire** si aucun créneau n'est disponible
- 📊 **Journalisation complète** de chaque transaction dans `Execution_Log.xlsx`
- ⚙️ **Configuration centralisée** via `Config.xlsx` — zéro code à modifier

---

## 📁 Architecture du Projet

```
mini-project-rpa/
│
├── 📄 Main.xaml                          ← Point d'entrée principal du robot
│
├── 📂 Workflows/
│   ├── 📄 InitAllSettings.xaml           ← Chargement configuration
│   ├── 📄 LireDemandesExcel.xaml         ← Lecture des patients en attente
│   ├── 📄 VerifierDisponibiliteAgenda.xaml ← Recherche créneau libre
│   ├── 📄 EnregistrerRDVExcel.xaml       ← Enregistrement du rendez-vous
│   ├── 📄 MettreAJourAgenda.xaml         ← Mise à jour agenda médecin
│   ├── 📄 EnvoyerNotificationPatient.xaml← Envoi email confirmation
│   └── 📄 NotifierSecretaire.xaml        ← Alerte si aucun créneau
│
├── 📂 Data/
│   ├── 📊 Config.xlsx                    ← Paramètres globaux du robot
│   ├── 📊 Demandes_Patients.xlsx         ← Input : liste des demandes
│   ├── 📊 Agenda_Medecin.xlsx            ← État des disponibilités
│   └── 📊 Execution_Log.xlsx             ← Journal des transactions
│
└── 📄 project.json                       ← Métadonnées UiPath Studio
```

---

## 🔄 Flux d'Exécution

```
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN.XAML                               │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  1. InitAllSettings │  ← Charge Config.xlsx → Dictionnaire Config
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  2. LireDemandesEx  │  ← Lit Demandes_Patients.xlsx → PatientNom,
│     cel             │    PatientTelephone, PatientMotif
└─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  3. VerifierDisponibilite│  ← Scanne Agenda_Medecin.xlsx →
│     Agenda               │    DateRDV, HeureRDV, DisponibiliteTrouvee
└──────────────────────────┘
         │
         ├──── DisponibiliteTrouvee = TRUE ────────────────────────┐
         │                                                         │
         ▼                                                         │
┌──────────────────────┐                               ┌──────────────────────┐
│  4. EnregistrerRDV   │                               │  ELSE: NotifierSec   │
│     Excel            │                               │  retaire             │
└──────────────────────┘                               │  (aucun créneau)     │
         │                                             └──────────────────────┘
         ▼
┌──────────────────────┐
│  5. MettreAJour      │  ← Marque créneau "Réservé" dans l'agenda
│     Agenda           │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  6. EnvoyerNotifica  │  ← Email SMTP personnalisé au patient
│     tionPatient      │
└──────────────────────┘
         │
         ▼
    TransactionStatus = "SUCCESS" / "NO_SLOT"
    [LOG] === FIN DU PROCESSUS ===
```

---

## 🧩 Description des Workflows

### 1. `Main.xaml` — Chef d'Orchestre

**Rôle** : Séquence maître qui appelle tous les sous-workflows dans l'ordre logique et gère la variable `TransactionStatus`.

**Variables déclarées** :

| Variable | Type | Description |
|---|---|---|
| `Config` | `Dictionary(String, Object)` | Paramètres chargés depuis Config.xlsx |
| `PatientNom` | `String` | Nom complet du patient |
| `PatientTelephone` | `String` | Numéro de téléphone |
| `PatientMotif` | `String` | Motif de consultation |
| `DateRDV` | `String` | Date du rendez-vous trouvé |
| `HeureRDV` | `String` | Heure du rendez-vous trouvé |
| `RDVConfirme` | `Boolean` | Confirmation d'enregistrement |
| `DisponibiliteTrouvee` | `Boolean` | Indique si un créneau est libre |
| `TransactionStatus` | `String` | `SUCCESS` ou `NO_SLOT` |

---

### 2. `InitAllSettings.xaml` — Chargement Configuration

**Rôle** : Ouvre `Config.xlsx`, lit la feuille `Config` et charge toutes les paires `Clé / Valeur` dans un dictionnaire partagé.

**Arguments** :

| Argument | Direction | Type | Description |
|---|---|---|---|
| `in_ConfigFilePath` | In | `String` | Chemin vers Config.xlsx |
| `out_Config` | Out | `Dictionary(String, Object)` | Dictionnaire peuplé |

**Logique interne** :
1. Crée un nouveau dictionnaire vide `v_Config`
2. Ouvre Config.xlsx en mode **lecture seule** et **invisible** (aucun conflit)
3. Lit toute la feuille `Config` dans un `DataTable`
4. Itère chaque ligne : si la colonne `Cle` est non-vide → ajoute `Cle/Valeur` dans le dictionnaire
5. Retourne le dictionnaire via `out_Config`
6. Log : `"Configuration chargée – N paramètres"`

---

### 3. `LireDemandesExcel.xaml` — Lecture Patients

**Rôle** : Lit le fichier `Demandes_Patients.xlsx` et extrait les informations du prochain patient à traiter (statut "En attente").

**Arguments** :

| Argument | Direction | Type | Description |
|---|---|---|---|
| `in_Config` | In | `Dictionary(String, Object)` | Accès au chemin du fichier |
| `out_PatientNom` | Out | `String` | Nom du patient |
| `out_PatientTelephone` | Out | `String` | Téléphone du patient |
| `out_PatientMotif` | Out | `String` | Motif de la consultation |

---

### 4. `VerifierDisponibiliteAgenda.xaml` — Recherche Créneau

**Rôle** : Scanne le fichier `Agenda_Medecin.xlsx` ligne par ligne à la recherche du premier créneau dont le statut est `"Libre"`.

**Arguments** :

| Argument | Direction | Type | Description |
|---|---|---|---|
| `in_Config` | In | `Dictionary(String, Object)` | Accès au chemin de l'agenda |
| `out_DateRDV` | Out | `String` | Date du créneau trouvé |
| `out_HeureRDV` | Out | `String` | Heure du créneau trouvé |
| `out_DisponibiliteTrouvee` | Out | `Boolean` | `True` si créneau trouvé |

---

### 5. `EnregistrerRDVExcel.xaml` — Enregistrement RDV

**Rôle** : Ajoute une nouvelle ligne dans le fichier historique patients avec toutes les informations du rendez-vous confirmé.

**Arguments entrants** : `in_Config`, `in_PatientNom`, `in_PatientTelephone`, `in_PatientMotif`, `in_DateRDV`, `in_HeureRDV`
**Argument sortant** : `out_RDVConfirme (Boolean)`

---

### 6. `MettreAJourAgenda.xaml` — Mise à Jour Agenda

**Rôle** : Modifie le statut du créneau réservé dans `Agenda_Medecin.xlsx` de `"Libre"` → `"Réservé – [PatientNom]"`.

---

### 7. `EnvoyerNotificationPatient.xaml` — Email Confirmation

**Rôle** : Envoie un email SMTP personnalisé au patient contenant la date, l'heure et les consignes de préparation au RDV.

---

### 8. `NotifierSecretaire.xaml` — Alerte Exception

**Rôle** : Workflow de gestion d'exception. Envoie un email d'alerte à la secrétaire du cabinet si **aucun créneau n'est disponible** pour le patient.

---

## 📊 Structure des Données

### `Config.xlsx` — Feuille `Config`

| Cle | Valeur | Description |
|---|---|---|
| `CheminDemandesPatients` | `Data\Demandes_Patients.xlsx` | Fichier des demandes |
| `CheminAgendaMedecin` | `Data\Agenda_Medecin.xlsx` | Agenda du médecin |
| `CheminExecutionLog` | `Data\Execution_Log.xlsx` | Journal des logs |
| `EmailCabinet` | `votre@gmail.com` | Adresse Gmail expéditrice |
| `SmtpPassword` | `xxxx xxxx xxxx xxxx` | Mot de passe d'application |
| `SmtpServeur` | `smtp.gmail.com` | Serveur SMTP |
| `SmtpPort` | `587` | Port TLS |
| `NomMedecin` | `Dr. Nom Prénom` | Affiché dans les emails |
| `NomCabinet` | `Cabinet Médical ...` | Nom du cabinet |

---

### `Demandes_Patients.xlsx`

| Colonne | Type | Description |
|---|---|---|
| `Nom` | String | Nom complet du patient |
| `Telephone` | String | Numéro de contact |
| `Motif` | String | Motif de consultation |
| `Email` | String | Adresse pour la confirmation |
| `Statut` | String | `En attente` / `Traité` |

---

### `Agenda_Medecin.xlsx`

| Colonne | Type | Description |
|---|---|---|
| `Date` | String/Date | Date du créneau |
| `Heure` | String | Heure du créneau (ex: `09:00`) |
| `Statut` | String | `Libre` / `Réservé` |
| `Patient` | String | Nom du patient réservant |

---

### `Execution_Log.xlsx`

| Colonne | Description |
|---|---|
| `Timestamp` | Horodatage de la transaction |
| `PatientNom` | Nom du patient traité |
| `DateRDV` | Date du rendez-vous |
| `HeureRDV` | Heure du rendez-vous |
| `Statut` | `SUCCESS` / `NO_SLOT` / `ERROR` |

---

## 📧 Configuration SMTP / Email

Le robot utilise le protocole **SMTP avec TLS** via Gmail pour envoyer les confirmations.

### Étapes pour obtenir un Mot de Passe d'Application Google

> ⚠️ Un mot de passe d'application est **différent** de votre mot de passe Gmail habituel. Il est généré spécifiquement pour les applications tierces.

1. Connectez-vous à votre compte Google : [myaccount.google.com](https://myaccount.google.com)
2. Allez dans **Sécurité** → **Connexion à Google**
3. Activez la **Validation en deux étapes** (obligatoire)
4. Dans **Sécurité** → **Mots de passe des applications**
5. Sélectionnez `Autre (nom personnalisé)` → Tapez `UiPath RDV Robot`
6. Cliquez **Générer** → Copiez le mot de passe à **16 caractères**
7. Collez-le dans `Config.xlsx` à la clé `SmtpPassword`

### Paramètres SMTP utilisés

```
Serveur  : smtp.gmail.com
Port     : 587
Sécurité : TLS (STARTTLS)
Auth     : Nom d'utilisateur + Mot de passe d'application
```

---

## 🛡️ Gestion des Erreurs & Robustesse

### Protection Anti-Crash (ContainsKey)

Chaque accès au dictionnaire `Config` est protégé par une vérification d'existence :

```vb
' ✅ Sécurisé
If Config.ContainsKey("EmailCabinet") Then
    emailExp = Config("EmailCabinet").ToString
End If

' ❌ Dangereux — peut lever KeyNotFoundException
emailExp = Config("EmailCabinet").ToString
```

### Zéro Conflit Excel (Activités Workbook)

Le projet utilise exclusivement les activités **Workbook** (NPOI) plutôt que **Excel Application Scope** classique pour :

- ✅ Fonctionner **sans Microsoft Excel installé**
- ✅ Éviter les conflits si le fichier est ouvert par un utilisateur
- ✅ Lecture en mode **ReadOnly** pour `Config.xlsx` (aucune modification accidentelle)
- ✅ Exécution possible sur des **machines virtuelles sans UI**

### Fallback Chemin par Défaut

Si `in_ConfigFilePath` est vide à l'appel, le robot utilise automatiquement :

```vb
If String.IsNullOrEmpty(in_ConfigFilePath) Then
    in_ConfigFilePath = "Data\Config.xlsx"
End If
```

### Gestion du Cas "Aucun Créneau"

Le robot ne crash pas si l'agenda est plein. La variable `DisponibiliteTrouvee` pilote le branchement :

```
DisponibiliteTrouvee = True  → Enregistrement + Confirmation patient
DisponibiliteTrouvee = False → Alerte secrétaire + TransactionStatus = "NO_SLOT"
```

---

## ⚙️ Prérequis & Installation

### Prérequis Système

| Composant | Version Minimale |
|---|---|
| UiPath Studio | 2022.10+ |
| .NET Framework | Windows / .NET 6+ |
| Microsoft Excel | ❌ Non requis (Workbook activities) |
| Compte Gmail | Avec validation 2 étapes activée |

### Packages UiPath Requis

```
UiPath.Excel.Activities        >= 2.16.0
UiPath.Mail.Activities         >= 1.16.0
UiPath.System.Activities       >= 22.10.0
UiPath.UiAutomation.Activities >= 22.10.0
```

### Installation

```bash
# 1. Cloner / extraire le projet
# 2. Ouvrir UiPath Studio
# 3. File → Open → Sélectionner le dossier du projet
# 4. Vérifier les dépendances : Manage Packages → Installed
# 5. Configurer Data\Config.xlsx (voir section suivante)
# 6. Lancer Main.xaml avec F5 ou le bouton Run
```

---

## 🔧 Paramétrage de Config.xlsx

Ouvrez `Data\Config.xlsx` et remplissez la feuille `Config` :

```
┌────────────────────────────────┬────────────────────────────────────┐
│ Cle                            │ Valeur                             │
├────────────────────────────────┼────────────────────────────────────┤
│ CheminDemandesPatients         │ Data\Demandes_Patients.xlsx        │
│ CheminAgendaMedecin            │ Data\Agenda_Medecin.xlsx           │
│ CheminExecutionLog             │ Data\Execution_Log.xlsx            │
│ EmailCabinet                   │ votre.cabinet@gmail.com            │
│ SmtpPassword                   │ abcd efgh ijkl mnop                │
│ SmtpServeur                    │ smtp.gmail.com                     │
│ SmtpPort                       │ 587                                │
│ NomMedecin                     │ Dr. Nom Prénom                     │
│ NomCabinet                     │ Cabinet Médical Mon Cabinet        │
└────────────────────────────────┴────────────────────────────────────┘
```

> ⚠️ **Ne commitez jamais `Config.xlsx` avec vos vraies credentials dans un dépôt public.**  
> Ajoutez `Data/Config.xlsx` à votre `.gitignore` et utilisez un fichier `Config.example.xlsx`.

---

## 📈 Exécution & Logs

### Logs UiPath Studio (Output Panel)

Le robot produit des logs structurés à chaque étape :

```
[INFO]  [RPA-RDV] === Démarrage du processus de prise de rendez-vous médical ===
[INFO]  Configuration chargée – 9 paramètres
[INFO]  [RPA-RDV] ÉTAPE 1 : Lecture du fichier Excel des demandes
[INFO]  [RPA-RDV] ÉTAPE 2 : Consultation de l'agenda du médecin
[INFO]  [RPA-RDV] ÉTAPE 3 : Enregistrement du rendez-vous dans Excel
[INFO]  [RPA-RDV] ÉTAPE 4 : Mise à jour de l'agenda du médecin
[INFO]  [RPA-RDV] ÉTAPE 5 : Envoi de la confirmation au patient
[INFO]  [RPA-RDV] ✅ Rendez-vous CONFIRMÉ pour Jean Dupont le 2025-06-15 à 10:30
[INFO]  [RPA-RDV] === Processus terminé. Statut : SUCCESS ===
```

### Statuts Possibles

| Statut | Signification |
|---|---|
| `SUCCESS` | RDV enregistré, agenda mis à jour, email envoyé |
| `NO_SLOT` | Aucun créneau libre, secrétaire notifiée |
| `ERROR` | Exception non gérée (voir logs détaillés) |

---

## 👤 Auteur

**Développé par LAITH MAHDI & DALEL LOUSSAIEF**  
📧 Contact : [mahdilaith380@gmail.com](mailto:mahdilaith380@gmail.com)

---

*Projet réalisé dans le cadre d'un mini-projet RPA — UiPath Studio, VB.NET, Excel Automation, SMTP Gmail.*