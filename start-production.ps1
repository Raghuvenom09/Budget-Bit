#!/usr/bin/env pwsh
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║        Budget Bit — Production Start Script                                  ║
# ║  Use this for local production testing                                       ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

param(
    [switch]$Detach
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Budget Bit - Production Start" -ForegroundColor Cyan
Write-Host ""

# Check for required .env files
$envFiles = @(
    @{ Path = "$root\client\.env"; Name = "Client" },
    @{ Path = "$root\ai\.env"; Name = "AI Service" }
)

foreach ($envFile in $envFiles) {
    if (-not (Test-Path $envFile.Path)) {
        Write-Host "ERROR: Missing $($envFile.Name) environment file: $($envFile.Path)" -ForegroundColor Red
        Write-Host "  Copy $($envFile.Name).env.example to $($envFile.Path) and configure" -ForegroundColor Yellow
        exit 1
    }
}

# Load env files
Get-Content "$root\client\.env" | ForEach-Object {
    if ($_ -match '^(.+?)=(.+)$') { Set-Content "env:$($Matches[1])" $Matches[2] }
}
Get-Content "$root\ai\.env" | ForEach-Object {
    if ($_ -match '^(.+?)=(.+)$') { Set-Content "env:$($Matches[1])" $Matches[2] }
}

Write-Host "Starting Client (nginx)  ->  http://localhost:80" -ForegroundColor Green
if ($Detach) {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command",
        "docker run --rm -p 80:80 --env-file '$root\client\.env' budget-bit-client"
} else {
    docker run --rm -p 80:80 --env-file "$root\client\.env" budget-bit-client
}

Start-Sleep -Seconds 2

Write-Host "Starting AI Service    ->  http://localhost:8000" -ForegroundColor Magenta
if ($Detach) {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command",
        "docker run --rm -p 8000:8000 --env-file '$root\ai\.env' budget-bit-ai"
} else {
    docker run --rm -p 8000:8000 --env-file "$root\ai\.env" budget-bit-ai
}

Write-Host ""
Write-Host "All services started." -ForegroundColor White
Write-Host ""
Write-Host "  Frontend   ->  http://localhost:80" -ForegroundColor Green
Write-Host "  AI Service ->  http://localhost:8000" -ForegroundColor Magenta
Write-Host "  AI Docs    ->  http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
