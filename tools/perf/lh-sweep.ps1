$url = "http://localhost:4321/"
$runs = 5
$outDir = "tools/perf/lighthouse"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

Write-Host "🚀 Starting Lighthouse Sweep ($runs runs) on $url" -ForegroundColor Green

# Use npx to run lighthouse without global install
$lighthouseCmd = "npx"
$lighthouseArgs = "lighthouse"

for ($i = 1; $i -le $runs; $i++) {
    Write-Host "👉 Run $i/$runs..." -NoNewline
    $outFile = "$outDir/run-$i.json"
    
    # Run lighthouse quietly via npx
    & $lighthouseCmd $lighthouseArgs $url --output=json --output-path=$outFile --chrome-flags="--headless" --only-categories=performance, accessibility, best-practices, seo, pwa --quiet
    
    Write-Host " Done." -ForegroundColor Green
}

Write-Host "✅ All runs completed. Results saved in $outDir" -ForegroundColor Cyan
