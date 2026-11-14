# MLŽIDLA.cz – příprava lokálního terminálu Qwen Code
# Spouštějte ručně z PowerShellu po kontrole skriptu.
$ErrorActionPreference = "Stop"

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Chybí příkaz $Name. Nainstalujte jej a spusťte tento skript znovu."
    }
}

Require-Command "node"
Require-Command "npm"
Require-Command "git"

$nodeMajor = [int]((node --version).TrimStart('v').Split('.')[0])
if ($nodeMajor -lt 22) {
    throw "Qwen Code vyžaduje Node.js 22+. Aktuální: $(node --version)"
}

$expectedRepo = "ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky"
if (-not (Test-Path "./package.json") -or -not (Test-Path "./QWEN.md")) {
    throw "Spusťte skript v kořeni repozitáře $expectedRepo po stažení větve obsahující QWEN.md."
}

$remote = (git remote get-url origin 2>$null)
if ($LASTEXITCODE -ne 0 -or $remote -notmatch "jakub1duch-a11y[/\\]ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky(\.git)?$") {
    throw "Nepotvrzený Git remote: $remote. Instalace se zastavila."
}

Write-Host "Instalace/aktualizace Qwen Code CLI..." -ForegroundColor Cyan
npm install -g @qwen-code/qwen-code@latest
if ($LASTEXITCODE -ne 0) { throw "Instalace Qwen Code selhala." }

Write-Host "Instalace projektových závislostí přes npm ci..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci selhalo." }

Write-Host "Hotovo. Verze Qwen Code:" -ForegroundColor Green
qwen --version

Write-Host "Dále spusťte: qwen" -ForegroundColor Green
Write-Host "V Qwen Code ověřte /auth, /memory, /skills a /mcp."
Write-Host "Merge, produkční nasazení ani MCP přístup skript neprovádí."
