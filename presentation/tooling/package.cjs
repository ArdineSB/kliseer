const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const JSZip = require('jszip');
const root = path.resolve(__dirname,'..');
async function main() {
  const report=JSON.parse(fs.readFileSync(path.join(root,'verification.json'),'utf8').replace(/^\uFEFF/,''));
  if(report.length!==12 || report.some(s=>s.issues.length || !s.hasNarration || !s.hasCue)) throw new Error('Native PowerPoint verification is incomplete or reports issues.');
  const thumbs=await Promise.all(report.map(async (s,i)=>({input:await sharp(path.join(root,'preview',`slide-${String(s.slide).padStart(2,'0')}.png`)).resize(640,360).png().toBuffer(),left:(i%3)*660+20,top:Math.floor(i/3)*380+20})));
  await sharp({create:{width:2000,height:1540,channels:3,background:'#E5E7EB'}}).composite(thumbs).png().toFile(path.join(root,'Kliseer-Slide-Overview.png'));
  const zip=new JSZip();
  const files=['Kliseer-Presentation-EN.pptx','Kliseer-Presentation-EN.pdf','Kliseer-Script-EN.md','Kliseer-Teleprompter-EN.txt','Kliseer-Slide-Overview.png'];
  for(const file of files) zip.file(file,fs.readFileSync(path.join(root,file)));
  for (const name of ['Sora-SemiBold.ttf','Sora-OFL.txt','InterPresentation-Regular.ttf','InterPresentation-Bold.ttf','Inter-OFL.txt']) {
    zip.file(`fonts/${name}`,fs.readFileSync(path.join(root,'../design/fonts',name)));
  }
  fs.writeFileSync(path.join(root,'Kliseer-Presentation-EN.zip'),await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
  console.log(JSON.stringify({verifiedSlides:report.length,overflowIssues:report.reduce((n,s)=>n+s.issues.length,0),editableTextShapes:report.reduce((n,s)=>n+s.editableTextShapes,0),packageFiles:files},null,2));
}
main().catch(err=>{console.error(err);process.exitCode=1;});
