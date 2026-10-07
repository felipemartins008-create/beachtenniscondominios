Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ACER\.gemini\antigravity\brain\16cce9cb-37c6-4dc0-b232-4575f96e8f3b\banner_square_bt_1791379194312.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]78)

# Target square dimensions: 800 x 800 px (ideal for WhatsApp cards)
$targetW = 800
$targetH = 800
$bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($img, 0, 0, $targetW, $targetH)
$graphics.Dispose()
$img.Dispose()

$destPath = "$PWD\public\assets\banner-beach-tennis.jpg"
if (Test-Path $destPath) {
    Remove-Item $destPath -Force
}

$bmp.Save($destPath, $codec, $encoderParams)
$bmp.Dispose()

$sizeKb = (Get-Item $destPath).Length / 1KB
Write-Host "Novo tamanho do banner quadrado: $sizeKb KB (800x800 px)"
