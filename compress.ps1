Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public\assets\banner-beach-tennis.jpg").Path
$img = [System.Drawing.Image]::FromFile($srcPath)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]75)

$targetW = 1200
$targetH = 675
$bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($img, 0, 0, $targetW, $targetH)
$graphics.Dispose()
$img.Dispose()

$destPath = "$PWD\public\assets\banner-opt.jpg"
$bmp.Save($destPath, $codec, $encoderParams)
$bmp.Dispose()

Remove-Item $srcPath
Move-Item $destPath $srcPath

$sizeKb = (Get-Item $srcPath).Length / 1KB
Write-Host "Novo tamanho do banner otimizado: $sizeKb KB"
