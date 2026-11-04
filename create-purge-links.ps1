Write-Host "Looking for jsdelivr links..." -ForegroundColor Red
$urls = Get-ChildItem -Recurse -File |
    Select-String 'https://cdn\.jsdelivr\.net.*lborgman/text[^"]+' -AllMatches |
    ForEach-Object {
        $_.Matches.Value
    } |
    Sort-Object -Unique

# $urls
$url2 = $urls | ForEach-Object {
    ($_ -replace '^https://cdn\.jsdelivr\.net/', 'https://purge.jsdelivr.net/')
}

Write-Host "jsdelivr links to purge:" -ForegroundColor Red
$url2

$html = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>jsDelivr Purge</title>

$(
    $url2 | ForEach-Object {
        if ($_ -match '\.css($|\?)') {
            "`n<link rel=""stylesheet"" href=""$_"">`n"
        }
        elseif ($_ -match '\.js($|\?)') {
            "`n<script src=""$_""></script>`n"
        }
        else {
            "`n<link rel=""preload"" href=""$_"">`n"
        }
    }
)

</head>
<body>
<h1>Purging jsdelivr links...</h1>
</body>
</html>
"@

$html | Set-Content purge-links.html

Write-Host "Created purge-links.html" -ForegroundColor Green