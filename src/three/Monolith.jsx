import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Monolith — os tres Degraus da marca, construidos pelo scroll.
 *
 * O progresso (0..1) chega por `progress` (ref mutavel, nunca state:
 * state re-renderiza a cada quadro e derruba o frame rate).
 *
 * Linha do tempo:
 *   0.00 – 0.22  degrau 1 sobe
 *   0.22 – 0.44  degrau 2 sobe
 *   0.44 – 0.66  degrau 3 sobe (Solda, o degrau "ainda quente")
 *   0.66 – 1.00  os tres desmontam em voxels que sobem e dispersam
 *
 * Como e scrub, o caminho de volta e o mesmo invertido — de graca.
 */

const VOXELS_POR_DEGRAU = 140;
const TOTAL_VOXELS = VOXELS_POR_DEGRAU * 3;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
// mapeia p de [a,b] para [0,1]
const faixa = (p, a, b) => clamp01((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function Monolith({ progress, accent = '#D14D29' }) {
  const grupo = useRef(null);
  const degrau1 = useRef(null);
  const degrau2 = useRef(null);
  const degrau3 = useRef(null);
  const voxels = useRef(null);

  // Geometria dos tres degraus: largura, altura, posicao X e Y final
  const degraus = useMemo(() => ([
    { alt: 1.0, x: -1.15, yBase: -1.55 },
    { alt: 2.2, x: 0.00, yBase: -1.55 },
    { alt: 3.4, x: 1.15, yBase: -1.55 },
  ]), []);

  // Nuvem de voxels: uma posicao alvo por cubo, distribuida dentro dos degraus
  const nuvem = useMemo(() => {
    const arr = [];
    degraus.forEach((d, di) => {
      for (let i = 0; i < VOXELS_POR_DEGRAU; i++) {
        arr.push({
          // origem: ponto aleatorio dentro do volume do degrau
          ox: d.x + (Math.random() - 0.5) * 0.9,
          oy: d.yBase + Math.random() * d.alt,
          oz: (Math.random() - 0.5) * 0.9,
          // destino da dispersao: sobe e espalha
          dx: (Math.random() - 0.5) * 7,
          dy: 2 + Math.random() * 5,
          dz: (Math.random() - 0.5) * 5,
          rot: Math.random() * Math.PI,
          giro: (Math.random() - 0.5) * 2.5,
          escala: 0.05 + Math.random() * 0.09,
          atraso: Math.random() * 0.35,   // dispersao nao e simultanea
          degrau: di,
        });
      }
    });
    return arr;
  }, [degraus]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const corSolda = useMemo(() => new THREE.Color(accent), [accent]);
  const corAco = useMemo(() => new THREE.Color('#8A8478'), []);

  useFrame((state) => {
    const p = clamp01(progress?.current ?? 0);
    const t = state.clock.elapsedTime;

    if (grupo.current) {
      // deriva lenta e constante — presenca, nao espetaculo
      grupo.current.rotation.y = Math.sin(t * 0.15) * 0.28 + p * 0.5;
      grupo.current.position.y = Math.sin(t * 0.4) * 0.06;
    }

    // ---- construcao dos degraus ----
    const refs = [degrau1, degrau2, degrau3];
    const janelas = [[0.0, 0.22], [0.22, 0.44], [0.44, 0.66]];

    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const d = degraus[i];
      const sobe = easeOut(faixa(p, janelas[i][0], janelas[i][1]));
      // desmonte: a partir de 0.66 o solido some dando lugar aos voxels
      const desmonta = faixa(p, 0.66, 0.80);
      const vivo = sobe * (1 - desmonta);

      ref.current.scale.y = Math.max(0.001, vivo);
      // cresce a partir da base, nao do centro
      ref.current.position.y = d.yBase + (d.alt * vivo) / 2;
      ref.current.material.opacity = vivo;
      ref.current.visible = vivo > 0.002;
    });

    // ---- dispersao em voxels ----
    if (voxels.current) {
      const disp = faixa(p, 0.66, 1.0);
      voxels.current.visible = disp > 0.001;

      if (disp > 0.001) {
        for (let i = 0; i < TOTAL_VOXELS; i++) {
          const v = nuvem[i];
          // cada cubo tem seu proprio atraso -> a nuvem "descola" em ondas
          const local = easeOut(clamp01((disp - v.atraso) / (1 - v.atraso)));
          dummy.position.set(
            v.ox + v.dx * local,
            v.oy + v.dy * local,
            v.oz + v.dz * local
          );
          const enc = v.escala * (1 - local * 0.55);
          dummy.scale.setScalar(Math.max(0.001, enc));
          dummy.rotation.set(v.rot + local * v.giro, v.rot * 1.3 + local * v.giro, 0);
          dummy.updateMatrix();
          voxels.current.setMatrixAt(i, dummy.matrix);

          // o degrau 3 leva a cor Solda para a dispersao
          const cor = v.degrau === 2 ? corSolda : corAco;
          voxels.current.setColorAt(i, cor);
        }
        voxels.current.instanceMatrix.needsUpdate = true;
        if (voxels.current.instanceColor) voxels.current.instanceColor.needsUpdate = true;
        // a nuvem apaga no fim do percurso
        voxels.current.material.opacity = 1 - faixa(p, 0.88, 1.0);
      }
    }
  });

  const aco = {
    color: '#1D1C1A',
    roughness: 0.35,
    metalness: 0.75,
    transparent: true,
  };

  return (
    <group ref={grupo} scale={0.95}>
      <mesh ref={degrau1} position={[degraus[0].x, degraus[0].yBase, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, degraus[0].alt, 0.95]} />
        <meshStandardMaterial {...aco} />
      </mesh>

      <mesh ref={degrau2} position={[degraus[1].x, degraus[1].yBase, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, degraus[1].alt, 0.95]} />
        <meshStandardMaterial {...aco} />
      </mesh>

      {/* o degrau mais alto e sempre Solda — o proximo passo, ainda quente */}
      <mesh ref={degrau3} position={[degraus[2].x, degraus[2].yBase, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, degraus[2].alt, 0.95]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.3}
          transparent
        />
      </mesh>

      {/* nuvem de voxels — um unico draw call para os 420 cubos */}
      <instancedMesh ref={voxels} args={[null, null, TOTAL_VOXELS]} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.5} transparent />
      </instancedMesh>
    </group>
  );
}
