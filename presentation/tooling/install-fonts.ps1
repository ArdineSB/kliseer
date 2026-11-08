$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class PresentationFontRegistration {
  [DllImport("gdi32.dll", CharSet=CharSet.Unicode)]
  public static extern int AddFontResourceEx(string file, uint flags, IntPtr reserved);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)]
  public static extern IntPtr SendMessageTimeout(IntPtr hwnd, uint msg, IntPtr wParam, IntPtr lParam, uint flags, uint timeout, out IntPtr result);
}
'@
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$fontsDir = Join-Path $env:LOCALAPPDATA 'Microsoft/Windows/Fonts'
New-Item -ItemType Directory -Force -Path $fontsDir | Out-Null
$key = 'HKCU:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts'
New-Item -Path $key -Force | Out-Null
$fonts = @{
  'Sora-SemiBold.ttf' = 'Sora SemiBold (TrueType)'
  'InterPresentation-Regular.ttf' = 'Inter Presentation Regular (TrueType)'
  'InterPresentation-Bold.ttf' = 'Inter Presentation Bold (TrueType)'
}
foreach ($filename in $fonts.Keys) {
  $source = Join-Path $repo "design/fonts/$filename"
  $destination = Join-Path $fontsDir $filename
  if (-not (Test-Path $destination)) { Copy-Item $source $destination }
  New-ItemProperty -Path $key -Name $fonts[$filename] -Value $destination -PropertyType String -Force | Out-Null
  [void][PresentationFontRegistration]::AddFontResourceEx($destination,0,[IntPtr]::Zero)
}
$result = [IntPtr]::Zero
[void][PresentationFontRegistration]::SendMessageTimeout([IntPtr]0xffff,0x1D,[IntPtr]::Zero,[IntPtr]::Zero,2,5000,[ref]$result)
$families = (New-Object System.Drawing.Text.InstalledFontCollection).Families.Name
foreach ($name in @('Sora SemiBold','Inter Presentation')) {
  if ($families -notcontains $name) { throw "$name is not available to the renderer." }
  Write-Output "Registered font family: $name"
}
