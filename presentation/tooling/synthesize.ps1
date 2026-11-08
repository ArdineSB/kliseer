param([string]$Voice = 'Microsoft Zira Desktop', [int]$Rate = 1)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
Add-Type -ReferencedAssemblies System.Speech -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.IO;
using System.Speech.Synthesis;
using System.Speech.AudioFormat;
public class NarrationMark {
  public string name;
  public double ms;
}
public static class KliseerSpeech {
  public static NarrationMark[] Render(string voice, int rate, string ssml, string output) {
    var marks = new List<NarrationMark>();
    using (var synth = new SpeechSynthesizer()) {
      synth.SelectVoice(voice);
      synth.Rate = rate;
      synth.Volume = 100;
      synth.BookmarkReached += (sender, e) => { marks.Add(new NarrationMark { name=e.Bookmark, ms=e.AudioPosition.TotalMilliseconds }); };
      // Match the desktop voice's native 16 kHz stream so bookmark times are not rescaled.
      synth.SetOutputToWaveFile(output, new SpeechAudioFormatInfo(16000, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
      synth.SpeakSsml(ssml);
      synth.SetOutputToNull();
    }
    return marks.ToArray();
  }
}
'@
$project = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$content = Get-Content (Join-Path $PSScriptRoot 'content.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$audioDir = Join-Path $project 'opening-video/public/presentation/audio'
New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
$manifest = @()
$index = 0
foreach ($scene in $content) {
  $index++
  $chunks = New-Object 'System.Collections.Generic.List[string]'
  $chunk = ''
  foreach ($word in ($scene.narration -split '\s+')) {
    if ($chunk.Length -gt 0 -and ($chunk.Length + $word.Length + 1) -gt 83) {
      $chunks.Add($chunk)
      $chunk = ''
    }
    if ($chunk.Length -gt 0) { $chunk += ' ' }
    $chunk += $word
    if ($word -match '[.!?;]$' -and $chunk.Length -ge 30) { $chunks.Add($chunk); $chunk = '' }
  }
  if ($chunk) { $chunks.Add($chunk) }
  $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><break time="600ms"/>'
  for ($j=0; $j -lt $chunks.Count; $j++) {
    $encoded = [System.Security.SecurityElement]::Escape($chunks[$j])
    $encoded = $encoded -replace '\bKliseer\b','<sub alias="Klee seer">Kliseer</sub>'
    $encoded = $encoded -replace '\bKlise\b','<sub alias="Klees">Klise</sub>'
    $encoded = $encoded -replace '\bVultr\b','<sub alias="Vulter">Vultr</sub>'
    $ssml += '<mark name="c' + $j + '"/>' + $encoded + ' '
  }
  $ssml += '<mark name="end"/><break time="900ms"/></speak>'
  $file = 'scene-{0:D2}.wav' -f $index
  $marks = [KliseerSpeech]::Render($Voice,$Rate,$ssml,(Join-Path $audioDir $file))
  if ($marks.Count -ne ($chunks.Count + 1)) { throw "Missing speech bookmarks on slide $index" }
  $captions = @()
  for ($j=0; $j -lt $chunks.Count; $j++) {
    $captions += [PSCustomObject]@{text=$chunks[$j];startMs=[Math]::Round($marks[$j].ms,2);endMs=[Math]::Round($marks[$j+1].ms,2);timestampMs=$null;confidence=$null}
  }
  $manifest += [PSCustomObject]@{slide=$index;title=$scene.title;section=$scene.section;file=$file;narration=$scene.narration;voice=$Voice;rate=$Rate;captions=$captions}
  Write-Output ("Slide {0:D2}: {1} timed caption phrases, spoken end {2:N2}s" -f $index,$chunks.Count,($marks[$marks.Count-1].ms/1000))
}
$manifest | ConvertTo-Json -Depth 7 | Set-Content (Join-Path $audioDir 'speech.json') -Encoding UTF8
Write-Output "Generated 12 English voice tracks using $Voice."
