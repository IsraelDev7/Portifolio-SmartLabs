import { forwardRef, useMemo } from 'react';

/**
 * PixelMonogram — o monograma "os Degraus" desenhado em celulas.
 *
 * Montado, e pixel a pixel identico ao <Monogram /> original: as mesmas
 * tres barras, nas mesmas coordenadas. A diferenca e que cada degrau e
 * uma grade de quadradinhos, o que permite montar e desmontar a marca
 * nivel a nivel sem trocar de arte.
 *
 * 96 celulas num unico SVG — sem imagem, sem canvas, sem dependencia.
 */

const SOLDA = '#D14D29';

/* Geometria identica a do Monogram: x, y, largura, altura no viewBox 100x100.
   O terceiro degrau e sempre o acento — o proximo passo, ainda quente. */
const DEGRAUS = [
  { x: 8,  y: 64, w: 24, h: 28, cols: 4, rows: 5,  acento: false },
  { x: 38, y: 44, w: 24, h: 48, cols: 4, rows: 8,  acento: false },
  { x: 68, y: 24, w: 24, h: 68, cols: 4, rows: 11, acento: true  },
];

/* As celulas se sobrepoem por um fio. Sem isso o antialiasing do SVG
   desenha uma linha clara em cada junta e o logo montado fica riscado. */
const SANGRIA = 0.14;

function montarCelulas() {
  const celulas = [];
  DEGRAUS.forEach((d, nivel) => {
    const cw = d.w / d.cols;
    const ch = d.h / d.rows;
    for (let c = 0; c < d.cols; c++) {
      for (let r = 0; r < d.rows; r++) {
        celulas.push({
          x: d.x + c * cw,
          y: d.y + r * ch,
          w: cw + SANGRIA,
          h: ch + SANGRIA,
          nivel,
          acento: d.acento,
        });
      }
    }
  });
  return celulas;
}

export const PixelMonogram = forwardRef(function PixelMonogram(
  { color = 'currentColor', accent = SOLDA, size = 24, ...props },
  ref
) {
  const celulas = useMemo(montarCelulas, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      overflow="visible"
      {...props}
    >
      <title>Israel Passos — monograma</title>
      {celulas.map((c, i) => (
        <rect
          key={i}
          className="pm-cell"
          data-nivel={c.nivel}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          fill={c.acento ? accent : color}
        />
      ))}
    </svg>
  );
});

export default PixelMonogram;
