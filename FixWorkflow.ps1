$filePath = "C:\Users\Mahdi\OneDrive\Documents\mini-project-rpa\Workflows\EnregistrerRDVExcel.xaml"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# ── Fix 1: DataTable creation ─────────────────────────────────────────────────
# BEFORE: New DataTable() With { .Columns = { ... } }  → .Columns is read-only
# AFTER:  IIFE with colon-separated statements
$old1 = '[ New DataTable() With { .Columns = { New DataColumn("Nom"), New DataColumn("Telephone"), New DataColumn("Motif"), New DataColumn("Date"), New DataColumn("Heure"), New DataColumn("Statut"), New DataColumn("Timestamp") } } ]'
$new1 = '[(Function() As DataTable : Dim dt As New DataTable() : dt.Columns.Add("Nom") : dt.Columns.Add("Telephone") : dt.Columns.Add("Motif") : dt.Columns.Add("Date") : dt.Columns.Add("Heure") : dt.Columns.Add("Statut") : dt.Columns.Add("Timestamp") : Return dt : End Function)()]'
$c1 = $content.Replace($old1, $new1)
if ($c1 -eq $content) { Write-Warning "Fix 1 did NOT match — check content" } else { Write-Host "Fix 1 applied OK" }
$content = $c1

# ── Fix 2: Row-addition lambda ────────────────────────────────────────────────
# BEFORE: Function() ... End Function()  → missing wrapping parens + colons
# AFTER:  (Function() As DataTable : ... : End Function)()
$old2 = '[ Function() Dim row As DataRow = dt_NewRow.NewRow() row("Nom") = in_PatientNom row("Telephone") = in_PatientTelephone row("Motif") = in_PatientMotif row("Date") = in_DateRDV row("Heure") = in_HeureRDV row("Statut") = "Confirmé" row("Timestamp") = v_Timestamp dt_NewRow.Rows.Add(row) Return dt_NewRow End Function() ]'
$new2 = '[(Function() As DataTable : Dim row As DataRow = dt_NewRow.NewRow() : row("Nom") = in_PatientNom : row("Telephone") = in_PatientTelephone : row("Motif") = in_PatientMotif : row("Date") = in_DateRDV : row("Heure") = in_HeureRDV : row("Statut") = "Confirmé" : row("Timestamp") = v_Timestamp : dt_NewRow.Rows.Add(row) : Return dt_NewRow : End Function)()]'
$c2 = $content.Replace($old2, $new2)
if ($c2 -eq $content) { Write-Warning "Fix 2 did NOT match — check content" } else { Write-Host "Fix 2 applied OK" }
$content = $c2

# ── Fix 3: LogMessage_2 double-quoted string ──────────────────────────────────
# BEFORE: [""[RPA-RDV] ... ""]  → double double-quotes = invalid VB expression
# AFTER:  ["[RPA-RDV] ... "]
$old3 = '[&quot;&quot;[RPA-RDV] ✅ Rendez-vous enregistré avec succès dans Excel&quot;&quot;]'
$new3 = '[&quot;[RPA-RDV] ✅ Rendez-vous enregistré avec succès dans Excel&quot;]'
$c3 = $content.Replace($old3, $new3)
if ($c3 -eq $content) { Write-Warning "Fix 3 did NOT match — check content" } else { Write-Host "Fix 3 applied OK" }
$content = $c3

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "✅ All fixes written to file."
