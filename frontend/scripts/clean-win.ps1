param(
  [switch]$ForceKillNode = $false
)

Write-Host "Starting Windows cleanup script for frontend...";

try {
  if ($ForceKillNode) {
    Write-Host "Stopping node processes...";
    Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
  }

  # kill any vite/esbuild/swc processes if present
  $names = @('esbuild','swc','lightningcss','vite','node')
  foreach ($name in $names) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
      Write-Host "Stopping process $($_.ProcessName) ID=$($_.Id)";
      Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
  }

  # Wait a moment for OS to release file handles
  Start-Sleep -Seconds 1

  $repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
  $nodeModules = Join-Path $repoRoot 'node_modules'
  $lockFile = Join-Path $repoRoot 'package-lock.json'

  if (Test-Path $nodeModules) {
    Write-Host "Removing node_modules (this may take a minute)...";
    # Try to remove with attributes reset
    Get-ChildItem -Path $nodeModules -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
      try { $_.Attributes = 'Normal' } catch {}
    }
    Remove-Item -Path $nodeModules -Recurse -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path $lockFile) {
    Write-Host "Removing package-lock.json...";
    Remove-Item -Path $lockFile -Force -ErrorAction SilentlyContinue
  }

  Write-Host "Reinstalling dependencies...";
  if (Test-Path $lockFile) {
    npm ci
    if ($LASTEXITCODE -ne 0) {
      Write-Host 'npm ci failed, try running the script again as Administrator or reboot and rerun the script.'
    }
  } else {
    # If no lockfile, use npm install
    npm install
    if ($LASTEXITCODE -ne 0) {
      Write-Host 'npm install failed, try running the script again as Administrator or reboot and rerun the script.'
    }
  }
  Write-Host 'Reinstall finished successfully.'
} catch {
  Write-Host "Cleanup failed: $_";
  exit 1
}
