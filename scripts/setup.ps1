$ErrorActionPreference = 'Stop'

Write-Host 'Checking required project files...'
$required = @(
    'package.json',
    '.env.example',
    'prisma/schema.prisma'
)

foreach ($item in $required) {
    if (-not (Test-Path $item)) {
        throw "Missing required file: $item"
    }
}

if (-not (Test-Path '.env')) {
    Write-Host 'Creating local .env from .env.example'
    Copy-Item '.env.example' '.env'
}

Write-Host 'Setup complete. Review .env and then run npm install, npm run db:generate, and npm run db:migrate.'
