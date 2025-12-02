# PowerShell script to replace all localhost:7000 URLs with production URL
# Usage: .\update-api-urls.ps1 -BackendUrl "https://tourbnb-backend.onrender.com"

param(
    [string]$BackendUrl = ""
)

if ([string]::IsNullOrEmpty($BackendUrl)) {
    Write-Host "Usage: .\update-api-urls.ps1 -BackendUrl 'https://tourbnb-backend.onrender.com'"
    exit 1
}

$OldUrl = "http://localhost:7000"

Write-Host "🔄 Updating all API URLs..."
Write-Host "From: $OldUrl"
Write-Host "To: $BackendUrl"
Write-Host ""

# Get all TypeScript/TSX files in frontend/src
$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.ts", "*.tsx"

$changedFiles = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -like "*$OldUrl*") {
        $newContent = $content -replace [regex]::Escape($OldUrl), $BackendUrl
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $changedFiles += $file.FullName
        Write-Host "✅ Updated: $($file.FullName)"
    }
}

if ($changedFiles.Count -eq 0) {
    Write-Host "❌ No files found with $OldUrl"
    exit 1
}

Write-Host ""
Write-Host "✅ All $($changedFiles.Count) URL(s) updated!"
Write-Host ""
Write-Host "📝 Next steps:"
Write-Host "1. Commit: git add . && git commit -m 'Update API URLs for production'"
Write-Host "2. Push: git push"
Write-Host "3. Vercel will auto-deploy with the new URLs"
