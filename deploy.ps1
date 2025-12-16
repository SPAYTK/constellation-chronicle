# deploy.ps1 - PowerShell deploy script for Sistema Lagrange (compatibilidad máxima)

Write-Host "Iniciando deploy del Sistema Lagrange..."

# Escribir la API key directamente en .env.local
$apiKey = "AIzaSyAm_qYKNgXqZa-nJiClbz66-CdGp5PR4V4"
Set-Content -Path .env.local -Value "VITE_GOOGLE_API_KEY=$apiKey"
if (!(Test-Path .env.local)) {
    Write-Host "ERROR: No se pudo crear .env.local"
    exit 1
}
Write-Host "API key escrita en .env.local"

# Instalar gh-pages globalmente si no existe
Write-Host "Verificando gh-pages..."
gh-pages --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Instalando gh-pages..."
    npm install --global gh-pages
}

# Build con API key
Write-Host "Construyendo proyecto..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en build. Abortando."
    exit 1
}

# Deploy
Write-Host "Desplegando a GitHub Pages..."
gh-pages -d dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en deploy. Abortando."
    exit 1
}

Write-Host "Deploy completado exitosamente!"
Write-Host "Sitio: https://as6173268.github.io/constellation-chronicle/"
