/**
 * ISRAEL PASSOS / SMART LABS — Sistema de logo v1.0
 * Todos os componentes aceitam:
 *   color  — cor da marca (default: 'currentColor', herda do CSS)
 *   accent — cor do degrau alto / ponto de solda (default: '#D14D29')
 *   size   — largura em px (altura proporcional via viewBox)
 *
 * Uso: <Monogram size={32} />  ·  <LogoHorizontal color="#F5F0E8" size={420} />
 */

const SOLDA = '#D14D29';

/** Monograma "os Degraus" — avatar, favicon, carimbo. Mínimo 16px. */
export function Monogram({ color = 'currentColor', accent = SOLDA, size = 48, ...props }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Israel Passos — monograma</title>
      <rect x="8" y="64" width="24" height="28" fill={color} />
      <rect x="38" y="44" width="24" height="48" fill={color} />
      <rect x="68" y="24" width="24" height="68" fill={accent} />
    </svg>
  );
}

/** Monograma monocromático (positivo/negativo conforme `color`). */
export function MonogramMono({ color = 'currentColor', size = 48, ...props }) {
  return <Monogram color={color} accent={color} size={size} {...props} />;
}

/** Monograma em contorno — marca d'água e fundos complexos. */
export function MonogramOutline({ color = 'currentColor', size = 48, ...props }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Israel Passos — monograma contorno</title>
      <g fill="none" stroke={color} strokeWidth="3">
        <rect x="9.5" y="65.5" width="21" height="25" />
        <rect x="39.5" y="45.5" width="21" height="45" />
        <rect x="69.5" y="25.5" width="21" height="65" />
      </g>
    </svg>
  );
}

/** Plaqueta SMART LABS — etiqueta técnica em mono com borda. */
export function SmartLabsPlate({ color = 'currentColor', size = 150, ...props }) {
  return (
    <svg viewBox="0 0 150 38" width={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Smart Labs — plaqueta</title>
      <rect x="1" y="1" width="148" height="36" fill="none" stroke={color} strokeWidth="1.5" />
      <text x="18" y="25" fontFamily="'JetBrains Mono', monospace" fontSize="15" letterSpacing="5" fill={color}>
        SMART LABS
      </text>
    </svg>
  );
}

/** Lockup primário horizontal — cabeçalhos, assinaturas, documentos. Mínimo 140px. */
export function LogoHorizontal({ color = 'currentColor', accent = SOLDA, size = 480, ...props }) {
  return (
    <svg viewBox="0 0 760 120" width={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Israel Passos / Smart Labs — lockup primário</title>
      <text x="0" y="78" fontFamily="'Space Grotesk', sans-serif" fontSize="72" fontWeight="700" letterSpacing="-1" fill={color}>
        ISRAEL PASSOS
      </text>
      <rect x="568" y="54" width="18" height="18" fill={accent} />
      <rect x="614" y="46" width="146" height="36" fill="none" stroke={color} strokeWidth="1.5" />
      <text x="632" y="70" fontFamily="'JetBrains Mono', monospace" fontSize="17" letterSpacing="5" fill={color}>
        SMART LABS
      </text>
    </svg>
  );
}

/** Lockup empilhado — formatos quadrados e verticais. */
export function LogoStacked({ color = 'currentColor', accent = SOLDA, size = 300, ...props }) {
  return (
    <svg viewBox="0 0 420 200" width={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Israel Passos / Smart Labs — lockup empilhado</title>
      <text x="0" y="62" fontFamily="'Space Grotesk', sans-serif" fontSize="62" fontWeight="700" letterSpacing="-1" fill={color}>ISRAEL</text>
      <text x="0" y="128" fontFamily="'Space Grotesk', sans-serif" fontSize="62" fontWeight="700" letterSpacing="-1" fill={color}>PASSOS</text>
      <rect x="248" y="106" width="16" height="16" fill={accent} />
      <rect x="0" y="152" width="196" height="34" fill="none" stroke={color} strokeWidth="1.5" />
      <text x="16" y="175" fontFamily="'JetBrains Mono', monospace" fontSize="15" letterSpacing="4.5" fill={color}>
        SMART LABS
      </text>
    </svg>
  );
}

/** Motivo degrau — divisor de seção e textura (último degrau sempre no acento). */
export function StepMotif({ color = 'currentColor', accent = SOLDA, size = 220, ...props }) {
  return (
    <svg viewBox="0 0 300 80" width={size} xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
      <title>Motivo degrau</title>
      <rect x="0" y="56" width="60" height="24" fill={color} />
      <rect x="70" y="36" width="60" height="44" fill={color} />
      <rect x="140" y="16" width="60" height="64" fill={accent} />
    </svg>
  );
}
