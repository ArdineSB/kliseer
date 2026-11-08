param([switch]$SaveTimings, [switch]$EmbedFonts)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$file = Join-Path $root 'Kliseer-Presentation-EN.pptx'
$preview = Join-Path $root 'preview'
New-Item -ItemType Directory -Path $preview -Force | Out-Null
$timing = Get-Content (Join-Path $root 'timing.json') -Raw | ConvertFrom-Json
$content = Get-Content (Join-Path $PSScriptRoot 'content.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$ppt = $null
$deck = $null
$report = @()
$hadExisting = $false
try {
  try {
    $ppt = [Runtime.InteropServices.Marshal]::GetActiveObject('PowerPoint.Application')
    $hadExisting = $true
  } catch {
    $ppt = New-Object -ComObject PowerPoint.Application
  }
  $deck = $ppt.Presentations.Open($file, 0, 0, 0)
  for ($i=1; $i -le $deck.Slides.Count; $i++) {
    $slide = $deck.Slides.Item($i)
    $slide.SlideShowTransition.AdvanceOnClick = -1
    $slide.SlideShowTransition.AdvanceOnTime = 0
    $slide.SlideShowTransition.AdvanceTime = $timing.slides[$i-1].duration
    $slide.Export((Join-Path $preview ('slide-{0:D2}.png' -f $i)), 'PNG', 1920, 1080)
    $issues = @()
    $textCount = 0
    $textBounds = @()
    $fontNames = @()
    foreach ($shape in $slide.Shapes) {
      if (($shape.Left -lt -0.5) -or ($shape.Top -lt -0.5) -or (($shape.Left + $shape.Width) -gt ($deck.PageSetup.SlideWidth + 0.5)) -or (($shape.Top + $shape.Height) -gt ($deck.PageSetup.SlideHeight + 0.5))) {
        $issues += "Off-slide shape: $($shape.Name)"
      }
      if ($shape.HasTextFrame -and $shape.TextFrame2.HasText) {
        $textCount++
        $frame = $shape.TextFrame2
        $availableH = $shape.Height - $frame.MarginTop - $frame.MarginBottom
        $availableW = $shape.Width - $frame.MarginLeft - $frame.MarginRight
        $r = $frame.TextRange
        for ($run=1; $run -le $r.Runs().Count; $run++) { $fontNames += $r.Runs($run).Font.Name }
        $textBounds += [PSCustomObject]@{name=$shape.Name;left=$r.BoundLeft;top=$r.BoundTop;right=($r.BoundLeft+$r.BoundWidth);bottom=($r.BoundTop+$r.BoundHeight)}
        if ($frame.TextRange.BoundHeight -gt ($availableH + 1)) {
          $issues += "Text height overflow: $($shape.Name): $([Math]::Round($frame.TextRange.BoundHeight,1)) > $([Math]::Round($availableH,1)) pt: $($frame.TextRange.Text)"
        }
        if ($frame.TextRange.BoundWidth -gt ($availableW + 1)) {
          $issues += "Text width overflow: $($shape.Name): $([Math]::Round($frame.TextRange.BoundWidth,1)) > $([Math]::Round($availableW,1)) pt: $($frame.TextRange.Text)"
        }
      }
    }
    for ($a=0; $a -lt $textBounds.Count; $a++) {
      for ($b=$a+1; $b -lt $textBounds.Count; $b++) {
        $dx = [Math]::Min($textBounds[$a].right,$textBounds[$b].right) - [Math]::Max($textBounds[$a].left,$textBounds[$b].left)
        $dy = [Math]::Min($textBounds[$a].bottom,$textBounds[$b].bottom) - [Math]::Max($textBounds[$a].top,$textBounds[$b].top)
        if ($dx -gt 2 -and $dy -gt 2) { $issues += "Text overlap: $($textBounds[$a].name) / $($textBounds[$b].name)" }
      }
    }
    $note = $slide.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text
    if (-not $note.Contains($content[$i-1].narration)) { $issues += 'Speaker Notes narration differs from the English source script.' }
    $report += [PSCustomObject]@{slide=$i; editableTextShapes=$textCount; fonts=@($fontNames | Sort-Object -Unique); hasNarration=$note.Contains('SAY:'); hasCue=$note.Contains('RECORDING CUE'); issues=@($issues)}
  }
  $deck.SaveAs((Join-Path $root 'Kliseer-Presentation-EN.pdf'), 32)
  if ($SaveTimings -or $EmbedFonts) { $deck.SaveAs($file,24, $(if ($EmbedFonts) { -1 } else { 0 })) }
  $report | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $root 'verification.json') -Encoding UTF8
  $report | ForEach-Object { Write-Output ("Slide {0:D2}: {1} editable text shapes, notes={2}, cues={3}, issues={4}" -f $_.slide,$_.editableTextShapes,$_.hasNarration,$_.hasCue,$_.issues.Count); $_.issues | ForEach-Object { Write-Output "  $_" } }
  Write-Output "Exported $($deck.Slides.Count) PNG previews and PDF using Microsoft PowerPoint."
} finally {
  if ($null -ne $deck) { $deck.Close(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck) }
  if ($null -ne $ppt) {
    if (-not $hadExisting) { $ppt.Quit() }
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($ppt)
  }
}
