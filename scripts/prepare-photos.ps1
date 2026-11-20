# Resizes the approved photos into the app's photo slots.
# Run from the project root:  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare-photos.ps1
Add-Type -AssemblyName System.Drawing

function Export-Photo {
  param(
    [string]$Source,
    [string]$Destination,
    [string]$CropPosition = 'Center',   # 'Center' | 'CenterLow' | 'CenterRight'
    [int]$Quality = 82
  )

  $img = [System.Drawing.Image]::FromFile((Resolve-Path $Source))
  try {
    # Fit to the 4:3 slot the layout uses, cropping rather than stretching
    $targetRatio = 4 / 3
    $srcRatio = $img.Width / $img.Height
    if ($srcRatio -gt $targetRatio) {
      $cropH = $img.Height
      $cropW = [int][math]::Round($img.Height * $targetRatio)
    } else {
      $cropW = $img.Width
      $cropH = [int][math]::Round($img.Width / $targetRatio)
    }

    # Horizontal crop is centred for every photo: the subjects sit centre/right
    # and the empty side carries the layout.
    $x = [int](($img.Width - $cropW) / 2)
    $y = [int](($img.Height - $cropH) / 2)

    # 'CenterRight' shifts the frame right: keeps a wide empty wall on the left
    # for the headline while holding the subject clear of the right edge.
    if ($CropPosition -eq 'CenterRight') {
      $x = [int][math]::Min(($img.Width - $cropW), ($img.Width - $cropW) * 0.65)
    }

    # 'CenterLow' biases the frame down so standing staff are not cropped at the head
    if ($CropPosition -eq 'CenterLow') {
      $y = [int][math]::Min(($img.Height - $cropH), ($img.Height - $cropH) * 0.75)
    }

    $outW = 1600
    $outH = [int][math]::Round($outW / $targetRatio)
    $bmp = New-Object System.Drawing.Bitmap $outW, $outH
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $outW, $outH), (New-Object System.Drawing.Rectangle $x, $y, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $g.Dispose()
    }

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
    $full = Join-Path (Get-Location) $Destination
    New-Item -ItemType Directory -Force -Path (Split-Path $full) | Out-Null
    $bmp.Save($full, $encoder, $params)
    $bmp.Dispose()
  } finally {
    $img.Dispose()
  }

  $size = [math]::Round((Get-Item $Destination).Length / 1KB)
  Write-Output "$Destination  ${outW}x${outH}  ${size}KB  (crop from ${x},${y} ${cropW}x${cropH})"
}

# Hero: cleaner sits right of centre; bias right so the left wall stays empty for the headline.
Export-Photo -Source 'hero-image.jfif'     -Destination 'public/photos/hero.jpg'     -CropPosition 'CenterRight'
# Home: horizontal sink shot, keep the middle band of the frame.
Export-Photo -Source 'home-image.jfif'     -Destination 'public/photos/home.jpg'     -CropPosition 'Center'
# Office: standing figure, bias down so the head is not clipped.
Export-Photo -Source 'office-image.jfif'   -Destination 'public/photos/office.jpg'   -CropPosition 'CenterLow'
# Supplies: product line-up, centred keeps the dispensers and towels in frame.
Export-Photo -Source 'products-image.jfif' -Destination 'public/photos/supplies.jpg' -CropPosition 'Center'
# About: three-person crew, bias down slightly to hold heads and the bucket.
Export-Photo -Source 'aboutus.jfif'        -Destination 'public/photos/about.jpg'    -CropPosition 'CenterLow'
