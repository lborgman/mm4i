Write-Host "Looking for jsdelivr links..." -ForegroundColor Green
$urls = Get-ChildItem -Recurse -File |
Select-String 'https://cdn\.jsdelivr\.net.*lborgman/text[^"]+' -AllMatches |
ForEach-Object {
    $_.Matches.Value
} |
Sort-Object -Unique

# $urls
# $url2 = $urls | ForEach-Object { ($_ -replace '^https://cdn\.jsdelivr\.net/', 'https://purge.jsdelivr.net/') }

Write-Host "Found jsdelivr links to purge:" -ForegroundColor Green
$urls

Write-Host "Copied those links to clipboard" -ForegroundColor Green
$urls | Set-Clipboard

Write-Host "You should paste them at the web page https://www.jsdelivr.com/tools/purge" -ForegroundColor Green
$answer = Read-Host "Open that web page now? (y/n)"
if ($answer -match '^(y|ye|yes)$') {
    Write-Host "Opening web page..." -ForegroundColor Green
    Start-Sleep -Seconds 4
    Start-Process "https://www.jsdelivr.com/tools/purge"
}
else {
    Write-Host "Did not open the web page" -ForegroundColor Red
}