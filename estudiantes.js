/* ============================================================
   estudiantes.js — El "libro de dibujo" de la pandilla 🎨
   ------------------------------------------------------------
   Aquí vive TODA la lógica de los muñecos (estudiantes) que se
   sientan en los pupitres. Las páginas (salon, perfil, etc.)
   importan de aquí, así solo se toca UN archivo para cambiarlos.

   Uso en cada página:
     import { DEF, buildAvatarSVG, buildPupitreHTML, POSICIONES }
       from "./estudiantes.js";
   ============================================================ */

/* ===== ESTUDIANTE POR DEFECTO ===== */
export const DEF = {
  sexo: "ella",
  piel: "#FDDBB4",
  pelo: "#1a0a00",
  ojos: "#3a1a00",
  cabello: "largo_ondulado",
  acc: []
};

/* ===== HELPERS DE COLOR ===== */
export function hex2rgb(hex){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export function darken(hex,f=0.7){
  let r=parseInt(hex.slice(1,3),16)*f|0, g=parseInt(hex.slice(3,5),16)*f|0, b=parseInt(hex.slice(5,7),16)*f|0;
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* ===== DIBUJAR EL MUÑECO (SVG) ===== */
export function buildAvatarSVG(a, w=120, h=160, animado=false){
  a = { ...DEF, ...a };
  if(!Array.isArray(a.acc)) a.acc = [];
  const p = a.piel, pd = darken(p,.82), pelo=a.pelo, ojos=a.ojos;
  const es = a.sexo === "ella";
  const id = Math.random().toString(36).slice(2);

  // cabello paths
  let cabellos = "";
  const cw = w*.38, cx = w/2, cy = h*.22;
  switch(a.cabello){
    case "corto":
      cabellos = `<ellipse cx="${cx}" cy="${cy-.5}" rx="${cw*.9}" ry="${cw*.55}" fill="${pelo}"/>`;
      break;
    case "medio":
      cabellos = `<ellipse cx="${cx}" cy="${cy}" rx="${cw*.95}" ry="${cw*.6}" fill="${pelo}"/>
      <rect x="${cx-cw*.85}" y="${cy}" width="${cw*.4}" height="${h*.12}" rx="4" fill="${pelo}"/>
      <rect x="${cx+cw*.45}" y="${cy}" width="${cw*.4}" height="${h*.12}" rx="4" fill="${pelo}"/>`;
      break;
    case "largo_liso":
      cabellos = `<ellipse cx="${cx}" cy="${cy-.5}" rx="${cw*.95}" ry="${cw*.6}" fill="${pelo}"/>
      <rect x="${cx-cw*.9}" y="${cy}" width="${cw*.42}" height="${h*.32}" rx="5" fill="${pelo}"/>
      <rect x="${cx+cw*.48}" y="${cy}" width="${cw*.42}" height="${h*.32}" rx="5" fill="${pelo}"/>`;
      break;
    case "largo_ondulado":
      cabellos = `<ellipse cx="${cx}" cy="${cy-.5}" rx="${cw*.95}" ry="${cw*.6}" fill="${pelo}"/>
      <path d="M${cx-cw*.85},${cy+h*.04} Q${cx-cw*1.1},${cy+h*.14} ${cx-cw*.85},${cy+h*.22} Q${cx-cw*1.05},${cy+h*.28} ${cx-cw*.8},${cy+h*.35}" stroke="${pelo}" stroke-width="${w*.085}" fill="none" stroke-linecap="round"/>
      <path d="M${cx+cw*.85},${cy+h*.04} Q${cx+cw*1.1},${cy+h*.14} ${cx+cw*.85},${cy+h*.22} Q${cx+cw*1.05},${cy+h*.28} ${cx+cw*.8},${cy+h*.35}" stroke="${pelo}" stroke-width="${w*.085}" fill="none" stroke-linecap="round"/>`;
      break;
    case "afro":
      cabellos = `<circle cx="${cx}" cy="${cy-h*.04}" r="${cw*1.05}" fill="${pelo}"/>`;
      break;
    case "trenzas":
      cabellos = `<ellipse cx="${cx}" cy="${cy-.5}" rx="${cw*.95}" ry="${cw*.6}" fill="${pelo}"/>
      <rect x="${cx-cw*.15}" y="${cy+h*.04}" width="${cw*.12}" height="${h*.38}" rx="4" fill="${pelo}"/>
      <rect x="${cx+cw*.03}" y="${cy+h*.04}" width="${cw*.12}" height="${h*.38}" rx="4" fill="${pelo}"/>`;
      break;
    case "calvo": cabellos=""; break;
  }

  // cara
  const faceR = w*.34;
  const faceY = cy+h*.04;

  // ojos
  const oy = faceY + h*.04;
  const ox = cx - faceR*.35;
  const ox2 = cx + faceR*.35;
  const er = w*.045;

  // boca
  const mouthY = faceY + h*.14;

  // cuerpo — más femenino o masculino
  const hombros = es ? w*.36 : w*.42;
  const cintura  = es ? w*.26 : w*.32;
  const cuerpoY  = faceY + h*.26;
  const cuerpoH  = h*.28;
  const colorCuerpo = es ? "#f4a0b8" : "#6a8fd8";

  // accesorios
  let accs = "";
  if(a.acc.includes("lentes_redondos")){
    accs += `<circle cx="${ox}" cy="${oy}" r="${er*1.5}" fill="none" stroke="#333" stroke-width="1.8"/>
    <circle cx="${ox2}" cy="${oy}" r="${er*1.5}" fill="none" stroke="#333" stroke-width="1.8"/>
    <line x1="${ox+er*1.5}" y1="${oy}" x2="${ox2-er*1.5}" y2="${oy}" stroke="#333" stroke-width="1.5"/>`;
  }
  if(a.acc.includes("lentes_cuadrados")){
    accs += `<rect x="${ox-er*1.6}" y="${oy-er*1.4}" width="${er*3.2}" height="${er*2.8}" rx="2" fill="none" stroke="#333" stroke-width="1.8"/>
    <rect x="${ox2-er*1.6}" y="${oy-er*1.4}" width="${er*3.2}" height="${er*2.8}" rx="2" fill="none" stroke="#333" stroke-width="1.8"/>
    <line x1="${ox+er*1.6}" y1="${oy}" x2="${ox2-er*1.6}" y2="${oy}" stroke="#333" stroke-width="1.5"/>`;
  }
  if(a.acc.includes("gorra")){
    accs += `<ellipse cx="${cx}" cy="${cy-h*.06}" rx="${faceR*1.1}" ry="${faceR*.45}" fill="${pelo}"/>
    <rect x="${cx-faceR*1.1}" y="${cy-h*.1}" width="${faceR*2.2}" height="${h*.08}" rx="3" fill="${darken(pelo,.8)}"/>
    <rect x="${cx}" y="${cy-h*.1}" width="${faceR*1.3}" height="${h*.04}" rx="2" fill="${darken(pelo,.7)}"/>`;
  }
  if(a.acc.includes("aretes")){
    accs += `<circle cx="${cx-faceR*.82}" cy="${faceY+h*.1}" r="${w*.028}" fill="#FFD700" stroke="#B8860B" stroke-width="1"/>
    <circle cx="${cx+faceR*.82}" cy="${faceY+h*.1}" r="${w*.028}" fill="#FFD700" stroke="#B8860B" stroke-width="1"/>`;
  }
  if(a.acc.includes("gomita") && a.cabello!=="calvo"){
    accs += `<circle cx="${cx}" cy="${cy-h*.02}" r="${w*.06}" fill="${colorCuerpo}" stroke="${darken(colorCuerpo)}" stroke-width="1.5"/>`;
  }
  if(a.acc.includes("vincha") && a.cabello!=="calvo"){
    accs += `<path d="M${cx-faceR*.9},${cy-h*.02} Q${cx},${cy-h*.1} ${cx+faceR*.9},${cy-h*.02}" fill="none" stroke="${colorCuerpo}" stroke-width="${w*.06}" stroke-linecap="round"/>`;
  }

  // animación de parpadeo
  const animCSS = animado ? `
    @keyframes blink_${id}{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.08)}}
    .ojo_${id}{animation:blink_${id} 4s ${Math.random()*2}s infinite;transform-origin:center;}
  ` : "";

  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  ${animado ? `<style>${animCSS}</style>` : ""}
  <!-- cabello trasero -->
  ${cabellos}
  <!-- cuello -->
  <rect x="${cx-w*.08}" y="${faceY+h*.18}" width="${w*.16}" height="${h*.1}" rx="4" fill="${pd}"/>
  <!-- cara -->
  <ellipse cx="${cx}" cy="${faceY}" rx="${faceR}" ry="${faceR*1.1}" fill="${p}" stroke="${pd}" stroke-width="1.5"/>
  <!-- cejas -->
  <path d="M${ox-er*1.2},${oy-er*2.2} Q${ox},${oy-er*2.8} ${ox+er*1.2},${oy-er*2.2}" stroke="${darken(pelo,.8)}" stroke-width="${w*.025}" fill="none" stroke-linecap="round"/>
  <path d="M${ox2-er*1.2},${oy-er*2.2} Q${ox2},${oy-er*2.8} ${ox2+er*1.2},${oy-er*2.2}" stroke="${darken(pelo,.8)}" stroke-width="${w*.025}" fill="none" stroke-linecap="round"/>
  <!-- ojos -->
  <g class="ojo_${id}">
    <ellipse cx="${ox}" cy="${oy}" rx="${er*1.1}" ry="${er*1.3}" fill="white"/>
    <circle cx="${ox}" cy="${oy}" r="${er*.8}" fill="${ojos}"/>
    <circle cx="${ox+er*.25}" cy="${oy-er*.25}" r="${er*.25}" fill="white" opacity=".8"/>
  </g>
  <g class="ojo_${id}">
    <ellipse cx="${ox2}" cy="${oy}" rx="${er*1.1}" ry="${er*1.3}" fill="white"/>
    <circle cx="${ox2}" cy="${oy}" r="${er*.8}" fill="${ojos}"/>
    <circle cx="${ox2+er*.25}" cy="${oy-er*.25}" r="${er*.25}" fill="white" opacity=".8"/>
  </g>
  <!-- nariz -->
  <ellipse cx="${cx}" cy="${faceY+h*.09}" rx="${er*.6}" ry="${er*.45}" fill="${pd}"/>
  <!-- boca -->
  <path d="M${cx-er*1.4},${mouthY} Q${cx},${mouthY+er*1.6} ${cx+er*1.4},${mouthY}" stroke="#c0506a" stroke-width="${w*.03}" fill="none" stroke-linecap="round"/>
  <!-- accesorios SOBRE cara -->
  ${accs}
  <!-- cuerpo -->
  <path d="M${cx-hombros},${cuerpoY} Q${cx-cintura},${cuerpoY+cuerpoH*.5} ${cx-cintura},${cuerpoY+cuerpoH}
    L${cx+cintura},${cuerpoY+cuerpoH} Q${cx+cintura},${cuerpoY+cuerpoH*.5} ${cx+hombros},${cuerpoY} Z"
    fill="${colorCuerpo}" stroke="${darken(colorCuerpo)}" stroke-width="1.5"/>
  <!-- brazo izq -->
  <path d="M${cx-hombros},${cuerpoY+h*.04} Q${cx-hombros*1.3},${cuerpoY+cuerpoH*.5} ${cx-hombros*.8},${cuerpoY+cuerpoH}"
    stroke="${colorCuerpo}" stroke-width="${w*.1}" fill="none" stroke-linecap="round"/>
  <ellipse cx="${cx-hombros*.78}" cy="${cuerpoY+cuerpoH}" rx="${w*.06}" ry="${w*.06}" fill="${p}" stroke="${pd}" stroke-width="1"/>
  <!-- brazo der -->
  <path d="M${cx+hombros},${cuerpoY+h*.04} Q${cx+hombros*1.3},${cuerpoY+cuerpoH*.5} ${cx+hombros*.8},${cuerpoY+cuerpoH}"
    stroke="${colorCuerpo}" stroke-width="${w*.1}" fill="none" stroke-linecap="round"/>
  <ellipse cx="${cx+hombros*.78}" cy="${cuerpoY+cuerpoH}" rx="${w*.06}" ry="${w*.06}" fill="${p}" stroke="${pd}" stroke-width="1"/>
</svg>`;
}

/* ===== PUPITRE ISOMÉTRICO (con el muñeco encima) ===== */
export function buildPupitreHTML(avatarSVG, dormido=false, nombre="", uid=""){
  const tilt = dormido ? "rotate(-15deg) translateY(4px)" : "none";
  return `
  <div class="pupitre" data-uid="${uid}" style="position:absolute">
    <svg width="130" height="110" viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg">
      <!-- sombra -->
      <ellipse cx="65" cy="105" rx="52" ry="10" fill="rgba(0,0,0,.15)"/>
      <!-- superficie del pupitre -->
      <path d="M15,40 L65,20 L115,40 L115,58 L65,78 L15,58 Z" fill="#c8a876" stroke="#7a5c2e" stroke-width="2"/>
      <path d="M15,40 L15,58 L65,78 L65,60 Z" fill="#a07840" stroke="#7a5c2e" stroke-width="1.5"/>
      <path d="M115,40 L115,58 L65,78 L65,60 Z" fill="#b08848" stroke="#7a5c2e" stroke-width="1.5"/>
      <!-- cuaderno encima -->
      <path d="M25,38 L65,22 L100,38 L100,52 L65,66 L25,52 Z" fill="#f8f4e8" stroke="#ccc" stroke-width="1" opacity=".9"/>
      <path d="M30,38 L68,23 L98,38" stroke="#a8d8ea" stroke-width="1" fill="none"/>
      <path d="M30,42 L97,42" stroke="#a8d8ea" stroke-width=".8" fill="none"/>
      <!-- patas -->
      <line x1="25" y1="58" x2="25" y2="90" stroke="#7a5c2e" stroke-width="4" stroke-linecap="round"/>
      <line x1="105" y1="58" x2="105" y2="90" stroke="#7a5c2e" stroke-width="4" stroke-linecap="round"/>
      <line x1="65" y1="78" x2="65" y2="108" stroke="#7a5c2e" stroke-width="3" stroke-linecap="round"/>
      <line x1="25" y1="90" x2="105" y2="90" stroke="#7a5c2e" stroke-width="2.5"/>
    </svg>
    <!-- avatar encima del pupitre -->
    <div style="position:absolute;bottom:52px;left:50%;transform:translateX(-50%) ${tilt};
      filter:drop-shadow(2px 3px 4px rgba(0,0,0,.25));pointer-events:none;">
      ${avatarSVG}
    </div>
    <!-- nombre -->
    <div style="position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);
      white-space:nowrap;font-family:'Permanent Marker',cursive;font-size:11px;
      color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.8);pointer-events:none;">
      ${nombre}
    </div>
  </div>`;
}

/* ===== POSICIONES ISOMÉTRICAS DE LOS PUPITRES ===== */
export const POSICIONES = [
  {x:30, y:230},{x:145,y:200},{x:260,y:170},{x:375,y:140},{x:490,y:110},
  {x:30, y:310},{x:145,y:280},{x:260,y:250},{x:375,y:220},{x:490,y:190},
  {x:30, y:390},{x:145,y:360},{x:260,y:330},{x:375,y:300},{x:490,y:270},
];
