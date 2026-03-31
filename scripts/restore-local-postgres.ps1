param(
  [string]$ContainerName = "",
  [string]$DatabaseName = "",
  [string]$UserName = "",
  [string]$Password = "",
  [int]$Port = 0,
  [string]$BackupPath = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFilePath = Join-Path $projectRoot ".env"

if (Test-Path $envFilePath) {
  Get-Content $envFilePath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
      $parts = $line -split "=", 2
      if ($parts.Count -eq 2) {
        [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
      }
    }
  }
}

if (-not $ContainerName) { $ContainerName = $env:CAPISHOP_DB_CONTAINER }
if (-not $DatabaseName) { $DatabaseName = $env:CAPISHOP_DB_NAME }
if (-not $UserName) { $UserName = $env:CAPISHOP_DB_USER }
if (-not $Password) { $Password = $env:CAPISHOP_DB_PASSWORD }
if ($Port -eq 0) {
  if ($env:CAPISHOP_DB_PORT) {
    $Port = [int]$env:CAPISHOP_DB_PORT
  } else {
    $Port = 54329
  }
}
if (-not $BackupPath) { $BackupPath = $env:CAPISHOP_DB_BACKUP_PATH }

if (-not $ContainerName) { $ContainerName = "capishop-postgres" }
if (-not $DatabaseName) { $DatabaseName = "postgres" }
if (-not $UserName) { $UserName = "capishop_admin" }
if (-not $Password) { throw "Falta CAPISHOP_DB_PASSWORD en .env o como parametro." }
if (-not $BackupPath) { $BackupPath = "supabase/db_cluster-04-09-2025@04-34-20.backup.gz" }

$backupFullPath = Join-Path $projectRoot $BackupPath

if (-not (Test-Path $backupFullPath)) {
  throw "No se encontro el backup en: $backupFullPath"
}

Write-Host "Proyecto:" $projectRoot
Write-Host "Backup:" $backupFullPath
Write-Host "Container:" $ContainerName
Write-Host "Database:" $DatabaseName
Write-Host "Port:" $Port

$existing = docker ps -a --filter "name=^${ContainerName}$" --format "{{.Names}}"

if (-not $existing) {
  Write-Host "Creando contenedor Postgres local..."
  docker run --name $ContainerName `
    -e POSTGRES_USER=$UserName `
    -e POSTGRES_PASSWORD=$Password `
    -e POSTGRES_DB=$DatabaseName `
    -p "${Port}:5432" `
    -d postgres:16 | Out-Null
} else {
  Write-Host "Reutilizando contenedor existente..."
  docker start $ContainerName | Out-Null
}

Write-Host "Esperando a que Postgres este listo..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  docker exec $ContainerName pg_isready -U $UserName -d $DatabaseName | Out-Null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
}

if (-not $ready) {
  throw "Postgres no estuvo listo a tiempo."
}

$tmpSql = Join-Path $env:TEMP "capishop_restore.sql"
Write-Host "Descomprimiendo backup..."
@"
const fs = require('fs');
const zlib = require('zlib');
const input = process.argv[2];
const output = process.argv[3];
const buf = fs.readFileSync(input);
fs.writeFileSync(output, zlib.gunzipSync(buf));
"@ | node - $backupFullPath $tmpSql

if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmpSql)) {
  throw "No se pudo descomprimir el backup."
}

Write-Host "Copiando SQL al contenedor..."
docker cp $tmpSql "${ContainerName}:/tmp/capishop_restore.sql" | Out-Null

if ($LASTEXITCODE -ne 0) {
  throw "No se pudo copiar el SQL al contenedor."
}

Write-Host "Restaurando backup..."
docker exec -e PGPASSWORD=$Password $ContainerName psql -U $UserName -d $DatabaseName -f /tmp/capishop_restore.sql

if ($LASTEXITCODE -ne 0) {
  throw "La restauracion SQL fallo dentro del contenedor."
}

Write-Host ""
Write-Host "Restauracion completada."
Write-Host "Nota: este backup incluye conexiones internas a la base 'postgres'."
Write-Host "Conexion local util: postgres://${UserName}:[hidden]@localhost:${Port}/postgres"
Write-Host "Abrir consola SQL:"
Write-Host "docker exec -it $ContainerName psql -U $UserName -d postgres"
