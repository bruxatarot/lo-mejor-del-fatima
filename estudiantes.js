/* ============================================================
   estudiantes.js — El "libro de dibujo" de la pandilla 🎨
   ------------------------------------------------------------
   Toda la lógica de los muñecos en UN solo lugar.
   Coordenadas fijas en viewBox 0 0 120 160 (se escala solo).

   Capas (orden de dibujo):
   1. pelo trasero (detrás de la cabeza)
   2. orejas, cuello
   3. cara
   4. pelo delantero (casquete SOBRE la frente — nadie queda calvo)
   5. facciones (cejas, ojos, nariz, boca)
   6. accesorios (cada uno con SU color)
   7. cuerpo
   ============================================================ */

export const DEF = {
  sexo: "ella",
  piel: "#FDDBB4",
  pelo: "#1a0a00",
  ojos: "#3a1a00",
  cabello: "largo_ondulado",
  acc: []
};

export function hex2rgb(hex){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export function darken(hex,f=0.7){
  let r=parseInt(hex.slice(1,3),16)*f|0, g=parseInt(hex.slice(3,5),16)*f|0, b=parseInt(hex.slice(5,7),16)*f|0;
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* Colores fijos de accesorios (independientes del pelo) */
const COLOR_GORRA   = "#D64545";  // rojo gorra
const COLOR_GORRA_D = "#A93232";
const COLOR_CINTILLO= "#E5399B";  // fucsia cintillo
const COLOR_LAZO    = "#E5399B";  // fucsia lazo
const COLOR_ORO     = "#FFD700";  // aretes

export function buildAvatarSVG(a, w=120, h=160, animado=false){
  a = { ...DEF, ...a };
  if(!Array.isArray(a.acc)) a.acc = [];
  const piel = a.piel, pielD = darken(piel,.82);
  const pelo = a.pelo, peloD = darken(pelo,.75);
  const ojos = a.ojos;
  const es = a.sexo === "ella";
  const id = Math.random().toString(36).slice(2);
  const camisa  = es ? "#f4a0b8" : "#6a8fd8";
  const camisaD = darken(camisa,.75);

  /* ---------- PELO TRASERO (detrás de la cabeza) ---------- */
  let peloAtras = "";
  switch(a.cabello){
    case "medio": // bob: masa que baja hasta la barbilla
      peloAtras = `<path d="M18,42 Q18,6 60,6 Q102,6 102,42 L102,84 Q102,92 94,92 L26,92 Q18,92 18,84 Z" fill="${pelo}"/>`;
      break;
    case "largo_liso": // cae recto hasta el pecho
      peloAtras = `<path d="M18,42 Q18,6 60,6 Q102,6 102,42 L104,116 Q104,122 98,122 L88,122 L88,96 L32,96 L32,122 L22,122 Q16,122 16,116 Z" fill="${pelo}"/>`;
      break;
    case "largo_ondulado": // cae con ondas a los lados
      peloAtras = `<path d="M18,42 Q18,6 60,6 Q102,6 102,42 L102,70 Q108,78 102,88 Q110,98 102,108 Q106,116 98,122 L86,120 L86,94 L34,94 L34,120 L22,122 Q14,116 18,108 Q10,98 18,88 Q12,78 18,70 Z" fill="${pelo}"/>`;
      break;
    case "afro": // nube grande alrededor
      peloAtras = `<circle cx="60" cy="42" r="52" fill="${pelo}"/>
      <circle cx="26" cy="56" r="18" fill="${pelo}"/>
      <circle cx="94" cy="56" r="18" fill="${pelo}"/>`;
      break;
    case "trenzas": // dos trenzas colgando a los lados
      peloAtras = `<path d="M18,42 Q18,6 60,6 Q102,6 102,42 L102,62 L18,62 Z" fill="${pelo}"/>
      <rect x="8" y="52" width="14" height="46" rx="7" fill="${pelo}"/>
      <rect x="98" y="52" width="14" height="46" rx="7" fill="${pelo}"/>
      <ellipse cx="15" cy="104" rx="6" ry="8" fill="${pelo}"/>
      <ellipse cx="105" cy="104" rx="6" ry="8" fill="${pelo}"/>
      <circle cx="15" cy="96" r="4" fill="${COLOR_LAZO}"/>
      <circle cx="105" cy="96" r="4" fill="${COLOR_LAZO}"/>`;
      break;
    // corto y calvo: nada atrás
  }

  /* ---------- PELO DELANTERO (casquete SOBRE la cara) ---------- */
  /* Media luna: arco exterior por la corona + línea de pelo sobre la frente.
     Se dibuja DESPUÉS de la cara → siempre tapa la frente. Nadie calvo. */
  let peloFrente = "";
  if(a.cabello === "afro"){
    peloFrente = `<path d="M22,58 Q14,2 60,2 Q106,2 98,58 Q84,32 60,32 Q36,32 22,58 Z" fill="${pelo}"/>`;
  } else if(a.cabello !== "calvo"){
    peloFrente = `<path d="M24,56 Q24,8 60,8 Q96,8 96,56 Q88,34 60,34 Q32,34 24,56 Z" fill="${pelo}"/>`;
  }

  /* ---------- ACCESORIOS (cada uno con su color) ---------- */
  let accs = "";
  // lentes redondos
  if(a.acc.includes("lentes_redondos")){
    accs += `<circle cx="47" cy="56" r="9" fill="rgba(255,255,255,.15)" stroke="#333" stroke-width="2"/>
    <circle cx="73" cy="56" r="9" fill="rgba(255,255,255,.15)" stroke="#333" stroke-width="2"/>
    <line x1="56" y1="56" x2="64" y2="56" stroke="#333" stroke-width="2"/>
    <line x1="38" y1="54" x2="26" y2="52" stroke="#333" stroke-width="2"/>
    <line x1="82" y1="54" x2="94" y2="52" stroke="#333" stroke-width="2"/>`;
  }
  // lentes cuadrados
  if(a.acc.includes("lentes_cuadrados")){
    accs += `<rect x="38" y="48" width="18" height="15" rx="3" fill="rgba(255,255,255,.15)" stroke="#333" stroke-width="2"/>
    <rect x="64" y="48" width="18" height="15" rx="3" fill="rgba(255,255,255,.15)" stroke="#333" stroke-width="2"/>
    <line x1="56" y1="55" x2="64" y2="55" stroke="#333" stroke-width="2"/>
    <line x1="38" y1="53" x2="26" y2="51" stroke="#333" stroke-width="2"/>
    <line x1="82" y1="53" x2="94" y2="51" stroke="#333" stroke-width="2"/>`;
  }
  // cintillo: banda de color sobre el pelo delantero
  if(a.acc.includes("vincha") && a.cabello!=="calvo"){
    accs += `<path d="M27,46 Q60,22 93,46" fill="none" stroke="${COLOR_CINTILLO}" stroke-width="7" stroke-linecap="round"/>`;
  }
  // lazo: moño a un lado de la cabeza (arriba a la derecha)
  if(a.acc.includes("gomita") && a.cabello!=="calvo"){
    accs += `<g transform="translate(88,20) rotate(15)">
      <path d="M0,0 L-12,-7 Q-15,0 -12,7 Z" fill="${COLOR_LAZO}"/>
      <path d="M0,0 L12,-7 Q15,0 12,7 Z" fill="${COLOR_LAZO}"/>
      <circle cx="0" cy="0" r="3.5" fill="${darken(COLOR_LAZO,.75)}"/>
    </g>`;
  }
  // gorra: SIEMPRE roja, con visera — tapa el pelo de arriba
  if(a.acc.includes("gorra")){
    accs += `<path d="M28,42 Q28,10 60,10 Q92,10 92,42 Z" fill="${COLOR_GORRA}"/>
    <path d="M28,42 Q60,34 92,42 L92,46 Q60,39 28,46 Z" fill="${COLOR_GORRA_D}"/>
    <path d="M86,40 L110,42 Q114,43 113,47 Q112,50 108,49 L86,47 Z" fill="${COLOR_GORRA_D}"/>
    <circle cx="60" cy="10" r="3" fill="${COLOR_GORRA_D}"/>`;
  }
  // aretes: dorados colgando de las orejas
  if(a.acc.includes("aretes")){
    accs += `<circle cx="23" cy="62" r="3.5" fill="${COLOR_ORO}" stroke="#B8860B" stroke-width="1"/>
    <circle cx="97" cy="62" r="3.5" fill="${COLOR_ORO}" stroke="#B8860B" stroke-width="1"/>`;
  }

  /* ---------- ANIMACIÓN DE PARPADEO ---------- */
  const animCSS = animado ? `<style>
    @keyframes blink_${id}{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.08)}}
    .ojo_${id}{animation:blink_${id} 4s ${(Math.random()*2).toFixed(2)}s infinite;transform-origin:center;transform-box:fill-box;}
  </style>` : "";

  /* ---------- SVG FINAL (capas en orden) ---------- */
  return `<svg viewBox="0 0 120 160" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  ${animCSS}
  <!-- 1. pelo trasero -->
  ${peloAtras}
  <!-- 2. orejas -->
  <circle cx="23" cy="56" r="7" fill="${piel}" stroke="${pielD}" stroke-width="1.5"/>
  <circle cx="97" cy="56" r="7" fill="${piel}" stroke="${pielD}" stroke-width="1.5"/>
  <!-- 2b. cuello -->
  <rect x="51" y="82" width="18" height="16" rx="5" fill="${pielD}"/>
  <!-- 3. cara -->
  <ellipse cx="60" cy="50" rx="37" ry="41" fill="${piel}" stroke="${pielD}" stroke-width="1.5"/>
  <!-- 4. pelo delantero (tapa la corona SIEMPRE) -->
  ${peloFrente}
  <!-- 5. facciones -->
  <path d="M41,45 Q47,42 53,45" fill="none" stroke="${peloD}" stroke-width="2" stroke-linecap="round"/>
  <path d="M67,45 Q73,42 79,45" fill="none" stroke="${peloD}" stroke-width="2" stroke-linecap="round"/>
  <g class="ojo_${id}">
    <ellipse cx="47" cy="56" rx="5.5" ry="6.5" fill="white"/>
    <circle cx="47" cy="56" r="4" fill="${ojos}"/>
    <circle cx="48.3" cy="54.6" r="1.3" fill="white" opacity=".85"/>
  </g>
  <g class="ojo_${id}">
    <ellipse cx="73" cy="56" rx="5.5" ry="6.5" fill="white"/>
    <circle cx="73" cy="56" r="4" fill="${ojos}"/>
    <circle cx="74.3" cy="54.6" r="1.3" fill="white" opacity=".85"/>
  </g>
  <ellipse cx="60" cy="64" rx="3" ry="2.2" fill="${pielD}"/>
  <path d="M52,71 Q60,78 68,71" fill="none" stroke="#c0506a" stroke-width="3" stroke-linecap="round"/>
  <!-- 6. accesorios -->
  ${accs}
  <!-- 7. cuerpo -->
  <path d="M24,152 L24,114 Q24,98 40,96 L80,96 Q96,98 96,114 L96,152 Z" fill="${camisa}" stroke="${camisaD}" stroke-width="1.5"/>
  ${es ? `<path d="M40,96 Q60,104 80,96" fill="none" stroke="${camisaD}" stroke-width="1.5" opacity=".5"/>` : ""}
  <!-- brazos -->
  <path d="M28,100 Q14,118 19,142" fill="none" stroke="${camisa}" stroke-width="12" stroke-linecap="round"/>
  <path d="M92,100 Q106,118 101,142" fill="none" stroke="${camisa}" stroke-width="12" stroke-linecap="round"/>
  <!-- manos -->
  <circle cx="19" cy="146" r="7" fill="${piel}" stroke="${pielD}" stroke-width="1"/>
  <circle cx="101" cy="146" r="7" fill="${piel}" stroke="${pielD}" stroke-width="1"/>
</svg>`;
}

/* ===== PUPITRE ISOMÉTRICO (con el muñeco encima) ===== */
export function buildPupitreHTML(avatarSVG, dormido=false, nombre="", uid=""){
  const tilt = dormido ? "rotate(-15deg) translateY(4px)" : "none";
  return `
  <div class="pupitre" data-uid="${uid}" style="position:absolute">
    <svg width="130" height="110" viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="65" cy="105" rx="52" ry="10" fill="rgba(0,0,0,.15)"/>
      <path d="M15,40 L65,20 L115,40 L115,58 L65,78 L15,58 Z" fill="#c8a876" stroke="#7a5c2e" stroke-width="2"/>
      <path d="M15,40 L15,58 L65,78 L65,60 Z" fill="#a07840" stroke="#7a5c2e" stroke-width="1.5"/>
      <path d="M115,40 L115,58 L65,78 L65,60 Z" fill="#b08848" stroke="#7a5c2e" stroke-width="1.5"/>
      <path d="M25,38 L65,22 L100,38 L100,52 L65,66 L25,52 Z" fill="#f8f4e8" stroke="#ccc" stroke-width="1" opacity=".9"/>
      <path d="M30,38 L68,23 L98,38" stroke="#a8d8ea" stroke-width="1" fill="none"/>
      <path d="M30,42 L97,42" stroke="#a8d8ea" stroke-width=".8" fill="none"/>
      <line x1="25" y1="58" x2="25" y2="90" stroke="#7a5c2e" stroke-width="4" stroke-linecap="round"/>
      <line x1="105" y1="58" x2="105" y2="90" stroke="#7a5c2e" stroke-width="4" stroke-linecap="round"/>
      <line x1="65" y1="78" x2="65" y2="108" stroke="#7a5c2e" stroke-width="3" stroke-linecap="round"/>
      <line x1="25" y1="90" x2="105" y2="90" stroke="#7a5c2e" stroke-width="2.5"/>
    </svg>
    <div style="position:absolute;bottom:52px;left:50%;transform:translateX(-50%) ${tilt};
      filter:drop-shadow(2px 3px 4px rgba(0,0,0,.25));pointer-events:none;">
      ${avatarSVG}
    </div>
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
