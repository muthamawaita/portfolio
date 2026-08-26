$ErrorActionPreference = 'Stop'

Write-Host 'Removing abandoned temporary uploads and stale processing artifacts.'
Write-Host 'This should respect the storage abstraction and should not delete active media still associated with a tenant or order.'
