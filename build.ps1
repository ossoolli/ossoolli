$ErrorActionPreference = "Stop"

$html = Get-Content -Path "index.html" -Raw -Encoding UTF8
$css = Get-Content -Path "style.css" -Raw -Encoding UTF8
$js = Get-Content -Path "script.js" -Raw -Encoding UTF8

$cssTag = "<style>`r`n$css`r`n</style>"
$jsTag = "<script>`r`n$js`r`n</script>"

$html = $html.Replace('<link rel="stylesheet" href="style.css">', $cssTag)
$html = $html.Replace('<script src="script.js"></script>', $jsTag)

Set-Content -Path "index.html" -Value $html -Encoding UTF8

Remove-Item -Path "style.css" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "script.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "build.py" -Force -ErrorAction SilentlyContinue

Write-Host "Success: All files merged into index.html!"
