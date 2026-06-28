param(
  [string]$ImageRoot = "assets\images\technology",
  [switch]$DeleteAfterApply
)

$ErrorActionPreference = "Stop"

function Test-WebPBytes {
  param([byte[]]$Bytes)
  return $Bytes.Length -ge 12 `
    -and [Text.Encoding]::ASCII.GetString($Bytes, 0, 4) -eq "RIFF" `
    -and [Text.Encoding]::ASCII.GetString($Bytes, 8, 4) -eq "WEBP"
}

function Get-Sha256Hex {
  param([byte[]]$Bytes)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    return (($sha.ComputeHash($Bytes) | ForEach-Object { $_.ToString("x2") }) -join "")
  } finally {
    $sha.Dispose()
  }
}

function Get-MetadataValue {
  param(
    [object]$Metadata,
    [string[]]$Names
  )
  if ($null -eq $Metadata) {
    return $null
  }
  foreach ($name in $Names) {
    if ($Metadata.PSObject.Properties.Name -contains $name) {
      return $Metadata.$name
    }
  }
  return $null
}

function Write-WebPBytes {
  param(
    [string]$Target,
    [byte[]]$Bytes,
    [object]$Metadata,
    [string]$Label
  )

  if (!(Test-WebPBytes -Bytes $Bytes)) {
    throw "decoded bytes are not WebP RIFF/WEBP"
  }

  $expectedSha = Get-MetadataValue -Metadata $Metadata -Names @("sha256", "sha256Hex", "SHA256")
  if ($expectedSha) {
    $actualSha = Get-Sha256Hex -Bytes $Bytes
    if ($actualSha.ToLowerInvariant() -ne ([string]$expectedSha).ToLowerInvariant()) {
      throw "SHA-256 mismatch: expected $expectedSha, actual $actualSha"
    }
  }

  $expectedSize = Get-MetadataValue -Metadata $Metadata -Names @("size", "bytes", "fileSize", "fileSizeBytes")
  if ($expectedSize -and $Bytes.Length -ne [int64]$expectedSize) {
    throw "size mismatch: expected $expectedSize bytes, actual $($Bytes.Length) bytes"
  }

  $targetDir = Split-Path -Parent $Target
  if ($targetDir -and !(Test-Path -LiteralPath $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
  }

  $backup = $Target + ".bak"
  $hadExisting = Test-Path -LiteralPath $Target
  if ($hadExisting) {
    Copy-Item -LiteralPath $Target -Destination $backup -Force
  }

  try {
    [System.IO.File]::WriteAllBytes($Target, $Bytes)
    if ($hadExisting) {
      Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue
    }
    Write-Host "[WEBP] decoded $Label -> $Target"
  } catch {
    if ($hadExisting -and (Test-Path -LiteralPath $backup)) {
      Move-Item -LiteralPath $backup -Destination $Target -Force
    }
    throw
  }
}

$root = if ([System.IO.Path]::IsPathRooted($ImageRoot)) {
  $ImageRoot
} else {
  Join-Path (Get-Location) $ImageRoot
}
if (!(Test-Path -LiteralPath $root)) {
  Write-Host "[SKIP] image root not found: $root"
  exit 0
}

$changed = 0
$processedPartPaths = New-Object 'System.Collections.Generic.HashSet[string]'

$manifests = Get-ChildItem -LiteralPath $root -Recurse -File -Filter "*.webp.b64.parts.json"
foreach ($manifest in $manifests) {
  try {
    $targetName = $manifest.Name.Substring(0, $manifest.Name.Length - ".b64.parts.json".Length)
    $target = Join-Path $manifest.DirectoryName $targetName
    $metadata = Get-Content -LiteralPath $manifest.FullName -Raw -Encoding UTF8 | ConvertFrom-Json

    $partPattern = [regex]::Escape($targetName + ".b64.part") + "(\d+)$"
    $parts = Get-ChildItem -LiteralPath $manifest.DirectoryName -File |
      Where-Object { $_.Name -match $partPattern } |
      Sort-Object @{ Expression = { [int]([regex]::Match($_.Name, $partPattern).Groups[1].Value) } }

    if (!$parts -or $parts.Count -eq 0) {
      throw "no part files found for $($manifest.Name)"
    }

    $expectedParts = Get-MetadataValue -Metadata $metadata -Names @("parts", "partCount", "count")
    if ($expectedParts -and $parts.Count -ne [int]$expectedParts) {
      throw "part count mismatch: expected $expectedParts, actual $($parts.Count)"
    }

    $b64Builder = [System.Text.StringBuilder]::new()
    foreach ($part in $parts) {
      [void]$processedPartPaths.Add($part.FullName)
      [void]$b64Builder.Append([System.IO.File]::ReadAllText($part.FullName, [Text.Encoding]::UTF8))
    }

    $b64 = ($b64Builder.ToString() -replace "\s", "")
    if ([string]::IsNullOrWhiteSpace($b64)) {
      throw "empty base64 parts"
    }

    $bytes = [Convert]::FromBase64String($b64)
    Write-WebPBytes -Target $target -Bytes $bytes -Metadata $metadata -Label "$($manifest.FullName) parts"
    $changed++

    if ($DeleteAfterApply) {
      foreach ($part in $parts) {
        Remove-Item -LiteralPath $part.FullName -Force -ErrorAction SilentlyContinue
      }
      Remove-Item -LiteralPath $manifest.FullName -Force -ErrorAction SilentlyContinue
    }
  } catch {
    Write-Host "[ERROR] failed part staging $($manifest.FullName): $($_.Exception.Message)"
  }
}

$suffixes = @(".webp.b64", ".webp.txt", ".img64", ".b64")
$sources = Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
  if ($processedPartPaths.Contains($_.FullName)) {
    return $false
  }
  $name = $_.Name.ToLowerInvariant()
  foreach ($suffix in $suffixes) {
    if ($name.EndsWith($suffix)) {
      return $true
    }
  }
  return $false
}

foreach ($src in $sources) {
  try {
    $base = $null
    $lower = $src.Name.ToLowerInvariant()
    foreach ($suffix in $suffixes) {
      if ($lower.EndsWith($suffix)) {
        $base = $src.Name.Substring(0, $src.Name.Length - $suffix.Length)
        break
      }
    }

    if ([string]::IsNullOrWhiteSpace($base)) {
      continue
    }

    $target = Join-Path $src.DirectoryName ($base + ".webp")
    $b64 = [System.IO.File]::ReadAllText($src.FullName, [Text.Encoding]::UTF8)
    $b64 = ($b64 -replace "\s", "")
    if ([string]::IsNullOrWhiteSpace($b64)) {
      throw "empty base64 staging file"
    }

    $bytes = [Convert]::FromBase64String($b64)
    Write-WebPBytes -Target $target -Bytes $bytes -Metadata $null -Label $src.FullName
    $changed++

    if ($DeleteAfterApply) {
      Remove-Item -LiteralPath $src.FullName -Force -ErrorAction SilentlyContinue
    }
  } catch {
    Write-Host "[ERROR] failed staging file $($src.FullName): $($_.Exception.Message)"
  }
}

Write-Host "[WEBP] staged replacements: $changed"
