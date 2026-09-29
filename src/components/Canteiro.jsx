import React from 'react';

/**
 * Canteiro — o estado "obra em construção" de um card da Work.
 *
 * ── por que um estado e não um card morto ──
 * Card sem destino já existia aqui: vira <div>, não clica, não foca, e
 * diz "Em breve" na legenda. Serve para obra que ainda não começou.
 *
 * Não serve para obra que está SENDO FEITA agora. Essa merece dizer
 * isso, e dizer com o gesto certo: quem clica descobre que há trabalho
 * em andamento ali, não uma porta trancada.
 *
 * ── por que engrenagem, e por que DUAS ──
 * Uma engrenagem sozinha girando é um ícone de carregamento — diz
 * "espere". Duas engrenadas dizem outra coisa: que há um mecanismo, que
 * uma move a outra, que existe trabalho acontecendo. É a diferença
 * entre uma ampulheta e uma oficina.
 *
 * E elas giram na razão CERTA. A menor tem 11 dentes, a maior 18; então
 * a menor dá 18/11 voltas para cada volta da maior, no sentido
 * contrário. Ninguém vai conferir — mas engrenagem que gira na razão
 * errada a gente percebe sem saber por quê, do mesmo jeito que se
 * percebe proporção tipográfica errada.
 *
 * ── por que os dentes são CALCULADOS ──
 * Desenhar dente à mão num editor dá um contorno que quase fecha: o
 * último dente nunca encaixa no primeiro, e o erro aparece girando. A
 * função abaixo percorre o círculo em passos exatos, então o dente 18
 * fecha no dente 1 por construção.
 *
 * ── por que CSS e não GSAP ──
 * Giro contínuo em laço não tem começo nem fim para o scroll amarrar, e
 * duas linhas do tempo vivas por card custam ticker à toa numa página
 * de listagem. `animation` com `linear infinite` roda no compositor e
 * pausa sozinha quando a peça está fechada. Mesma decisão da falha dos
 * ícones de partilha.
 */

/**
 * O contorno de uma engrenagem de `n` dentes.
 *
 * Quatro pontos por dente: começo e fim do topo, começo e fim do vale.
 * `larg` é a meia-largura do topo em fração do passo angular, e `flanco`
 * é quanto do passo o dente gasta subindo e descendo — é ele que dá o
 * chanfro em vez de um dente retangular de brinquedo.
 */
function contornoEngrenagem(n, rTopo, rVale, larg = 0.19, flanco = 0.1) {
  const passo = (Math.PI * 2) / n;
  const pontos = [];
  for (let i = 0; i < n; i++) {
    const a = i * passo;
    pontos.push(
      [a - larg * passo, rTopo],
      [a + larg * passo, rTopo],
      [a + (larg + flanco) * passo, rVale],
      [a + passo - (larg + flanco) * passo, rVale],
    );
  }
  return pontos
    .map(([a, r], i) =>
      `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`)
    .join(' ') + ' Z';
}

/* Furos de alívio: o que uma engrenagem real tem para não pesar mais do
   que precisa. São eles que fazem o giro ser legível — um disco liso
   girando parece parado. */
function furos(qtd, raio, tam) {
  return Array.from({ length: qtd }, (_, i) => {
    const a = (i / qtd) * Math.PI * 2;
    return { cx: Math.cos(a) * raio, cy: Math.sin(a) * raio, r: tam };
  });
}

const GRANDE = { n: 18, rTopo: 100, rVale: 84, furos: furos(6, 52, 15) };
const PEQUENA = { n: 11, rTopo: 61, rVale: 51, furos: furos(4, 30, 10) };

function Engrenagem({ peca, className }) {
  return (
    <g className={className}>
      <path d={contornoEngrenagem(peca.n, peca.rTopo, peca.rVale)} />
      {peca.furos.map((f, i) => <circle key={i} cx={f.cx} cy={f.cy} r={f.r} className="cant__furo" />)}
      <circle r={peca.rTopo * 0.17} className="cant__eixo" />
    </g>
  );
}

export default function Canteiro({ aberto }) {
  return (
    <span className={`cant${aberto ? ' e-aberto' : ''}`} aria-hidden={!aberto}>
      {/* A faixa listrada: a linguagem universal de canteiro, refeita na
          cor da casa. Ela varre de um lado ao outro em vez de ficar
          parada, porque faixa parada é aviso e faixa que anda é obra. */}
      <span className="cant__faixa" aria-hidden="true" />

      <svg className="cant__mec" viewBox="-128 -166 366 300" aria-hidden="true">
        {/* ── por que a menor fica exatamente à DIREITA da maior ──
            Duas condições precisam valer juntas para o par ler como
            engrenado, e não como duas peças girando perto:

              1. a distância entre centros tem de ser a soma dos raios
                 primitivos — aqui 92 + 56 = 148;
              2. onde há dente de uma tem de haver VALE da outra.

            A primeira versão errava as duas: 158 de distância (10 de
            folga) e a fase por acaso. A segunda cai de graça por causa
            da aritmética destes dois números: com 18 dentes existe topo
            exatamente em 0°, e com 11 dentes existe vale exatamente em
            180° — o vale de índice 5, porque 5,5 × 32,727° = 180 na
            unha. Alinhados nesse eixo, encaixam sem nenhuma correção.

            A inclinação é do PAR inteiro, e não de cada peça: girar o
            conjunto preserva o encaixe; girar uma só o destruiria. */}
        <g transform="rotate(-20)">
          <g transform="translate(0 0)">
            <Engrenagem peca={GRANDE} className="cant__eng cant__eng--grande" />
          </g>
          <g transform="translate(148 0)">
            <Engrenagem peca={PEQUENA} className="cant__eng cant__eng--pequena" />
          </g>
        </g>
      </svg>

      <span className="cant__dizer">
        <b>Obra em construção</b>
        <i>A página desta obra está sendo montada agora.</i>
      </span>
    </span>
  );
}
