// Vanilla WebGL adaptation of background_animation.md, including pointer drag and click rings.
// Decorative only. CSS fallback and foreground content never depend on this program.
const vertex = `#version 300 es
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
const fragment = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uFrame;
uniform vec2 uLamp;
uniform float uLampOn;
uniform vec2 uSmear;
uniform vec4 uRipple[4];
out vec4 frag;
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1,0)), u.x),
             mix(hash12(i + vec2(0,1)), hash12(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for(int i=0;i<4;i++){ v += a * noise(p); p = r * p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
float lobe(vec2 q, vec2 c, vec2 s){ vec2 d = (q-c)/s; return exp(-dot(d,d)); }
void main(){
  vec2 weave=(vec2(hash12(vec2(uFrame,3.1)),hash12(vec2(7.7,uFrame)))-.5)*.4/uRes;
  vec2 uv=gl_FragCoord.xy/uRes+weave; uv.y=1.0-uv.y;
  vec2 asp=vec2(uRes.x/uRes.y,1.0);
  vec2 q=uv;
  vec2 dm=(q-uLamp)*asp;
  float fall=exp(-dot(dm,dm)/(.42*.42));
  q+=(uLamp-q)*fall*.6*.32*uLampOn;
  q-=uSmear*fall;
  float ring=0.0;
  for(int i=0;i<4;i++){
    vec4 r=uRipple[i]; float age=uTime-r.z;
    if(r.w<=0.0||age<0.0||age>2.0) continue;
    vec2 rd=(q-r.xy)*asp; float dist=length(rd);
    float w=exp(-pow((dist-age*.55)/.06,2.0))*exp(-age*1.8)*r.w;
    q+=(rd/max(dist,.0001))/asp*w*.03; ring+=w;
  }
  float t=uTime;
  q+=(vec2(fbm(q*1.4+vec2(0,t*.06)),fbm(q*1.4+vec2(5.2,1.3-t*.048)))-.5)*.2;
  float sway=sin(q.x*3.3+t*.21)*.025+sin(q.x*7.1-t*.13)*.01;
  float edge=.45+.2*smoothstep(.02,.5,q.x)-.1*smoothstep(.45,1.0,q.x)+sway;
  float soft=mix(.03,.12,smoothstep(0.0,.8,q.x))+.004;
  float folded=1.0-smoothstep(edge-soft,edge+soft,q.y);
  vec3 ink=vec3(.067,.067,.071), silver=vec3(.824,.820,.839), violet=vec3(.604,.310,.690);
  vec3 lavender=vec3(.714,.675,.839), shadow=vec3(.024,.020,.024), ember=vec3(.525,.439,.373);
  float haze=lobe(q,vec2(.34,.2),vec2(.75,.52));
  float under=lobe(q,vec2(.44,.56),vec2(.24,.1))*.34;
  float light=min(haze*1.18,1.0)*folded+under;
  vec3 col=mix(ink,mix(silver,lavender,lobe(q,vec2(.5,.02),vec2(.3,.24))*.8),clamp(light,0.0,1.0));
  col=mix(col,violet,lobe(q,vec2(.7,0),vec2(.27,.24))*.72);
  col=mix(col,ember,lobe(q,vec2(.66,.28),vec2(.18,.09))*.7*.75);
  float sd=dot(q-vec2(.6,.37),vec2(.874,.486))+sway*.8;
  col=mix(col,shadow,smoothstep(-.14,.26,sd)*(1.0-fall*.55*uLampOn)*.97);
  col+=silver*lobe(q,vec2(.67,.53),vec2(.13,.05))*.14;
  col=mix(col,ink,smoothstep(.62,.92,uv.y)*.8);
  col+=silver*(fall*.08*uLampOn+ring*.07);
  vec2 v=(uv-vec2(.36,.3))*vec2(1.0,1.1);
  col=mix(col,ink*.85,.5*smoothstep(.45,1.1,length(v)));
  float grain=hash12(floor(gl_FragCoord.xy)+uFrame*vec2(17.13,31.71))-.5;
  col+=grain*.045;
  frag=vec4(clamp(col,0.0,1.0),1.0);
}`;

export function mountHaze(canvas: HTMLCanvasElement) {
  const hero = canvas.closest<HTMLElement>('#hero');
  if (!hero) return;
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) { canvas.hidden = true; return; }
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const program = vs && fs ? gl.createProgram() : null;
  if (!program || !vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    canvas.hidden = true;
    return;
  }
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); canvas.hidden = true; return; }
  const vao = gl.createVertexArray();
  const res = gl.getUniformLocation(program, 'uRes');
  const time = gl.getUniformLocation(program, 'uTime');
  const grainFrame = gl.getUniformLocation(program, 'uFrame');
  const lamp = gl.getUniformLocation(program, 'uLamp');
  const lampStrength = gl.getUniformLocation(program, 'uLampOn');
  const smear = gl.getUniformLocation(program, 'uSmear');
  const ripple = gl.getUniformLocation(program, 'uRipple');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let lost = false;
  let frame = 0;
  let lastPaint = 0;
  let elapsed = 9;
  let targetX = .5, targetY = .4, lampX = .5, lampY = .4;
  let smearX = 0, smearY = 0, lampOn = 0;
  let inside = false, lastTouched = -Infinity, rippleNext = 0;
  const ripples = new Float32Array(16);
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || lost || !visible || reduced.matches || document.hidden || document.documentElement.dataset.motion === 'paused') return;
    const bounds = canvas.getBoundingClientRect();
    targetX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    targetY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    inside = true;
    lastTouched = performance.now();
  };
  const onLeave = () => { inside = false; };
  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || event.pointerType === 'touch' || lost || !visible || reduced.matches || document.hidden || document.documentElement.dataset.motion === 'paused') return;
    if (event.target instanceof Element && event.target.closest('a,button,input,textarea,select,label,[role=button]')) return;
    onMove(event);
    const offset = rippleNext * 4;
    ripples[offset] = targetX; ripples[offset + 1] = targetY;
    ripples[offset + 2] = elapsed; ripples[offset + 3] = 1;
    rippleNext = (rippleNext + 1) % 4;
  };
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerdown', onDown, { passive: true });
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('pointercancel', onLeave);
  const resize = () => {
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    const scale = Math.min(devicePixelRatio || 1, 1, Math.sqrt(640000 / (w*h)));
    canvas.width = Math.round(w*scale); canvas.height = Math.round(h*scale);
  };
  const paint = (now: number) => {
    frame = 0;
    if (now - lastPaint >= 1000/30) {
      const dt = lastPaint ? Math.min((now - lastPaint) / 1000, .1) : 0;
      elapsed += dt;
      const idle = !inside || now - lastTouched > 5000;
      const wantX = idle ? .42 + .22 * Math.sin(elapsed * .19) + .08 * Math.sin(elapsed * .071 + 1.3) : targetX;
      const wantY = idle ? .38 + .16 * Math.cos(elapsed * .15) + .06 * Math.cos(elapsed * .047 + 4.2) : targetY;
      const ease = 1 - Math.exp(-dt * (idle ? 1.2 : 6));
      const nx = lampX + (wantX - lampX) * ease, ny = lampY + (wantY - lampY) * ease;
      if (dt > 0) {
        const relaxation = 1 - Math.exp(-dt * 5);
        smearX += (Math.max(-3, Math.min(3, (nx - lampX) / dt)) * .06 - smearX) * relaxation;
        smearY += (Math.max(-3, Math.min(3, (ny - lampY) / dt)) * .06 - smearY) * relaxation;
      }
      lampX = nx; lampY = ny;
      lampOn += ((idle ? .5 : 1) - lampOn) * (1 - Math.exp(-dt * 3));
      gl.useProgram(program); gl.bindVertexArray(vao); gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(res, canvas.width, canvas.height); gl.uniform1f(time, elapsed);
      gl.uniform1f(grainFrame, Math.floor(elapsed * 24) % 4096);
      gl.uniform2f(lamp, lampX, lampY); gl.uniform1f(lampStrength, lampOn);
      gl.uniform2f(smear, smearX, smearY); gl.uniform4fv(ripple, ripples);
      gl.drawArrays(gl.TRIANGLES,0,3);
      canvas.dataset.rendered = 'true';
      lastPaint = now;
    }
    if (visible && !document.hidden && !reduced.matches && document.documentElement.dataset.motion !== 'paused' && !lost) frame = requestAnimationFrame(paint);
  };
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0;
    lastPaint = 0;
    const running = visible && !document.hidden && !reduced.matches && document.documentElement.dataset.motion !== 'paused' && !lost;
    canvas.dataset.running = String(running);
    if (running) frame = requestAnimationFrame(paint);
  };
  const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); sync(); });
  const sizeObserver = new ResizeObserver(() => { resize(); sync(); });
  observer.observe(canvas); sizeObserver.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('kliseer:motion', sync);
  reduced.addEventListener('change', sync);
  canvas.addEventListener('webglcontextlost', () => { lost = true; canvas.hidden = true; sync(); });
  window.addEventListener('pageshow', sync);
  window.addEventListener('pagehide', (event) => {
    cancelAnimationFrame(frame); frame = 0; lastPaint = 0;
    canvas.dataset.running = 'false';
    if (event.persisted) return;
    lost = true; observer.disconnect(); sizeObserver.disconnect();
    document.removeEventListener('visibilitychange', sync); document.removeEventListener('kliseer:motion', sync);
    reduced.removeEventListener('change', sync); window.removeEventListener('pageshow', sync);
    hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerdown', onDown);
    hero.removeEventListener('pointerleave', onLeave); hero.removeEventListener('pointercancel', onLeave);
    gl.deleteVertexArray(vao); gl.deleteProgram(program); canvas.hidden = true;
  });
  resize(); sync();
}
