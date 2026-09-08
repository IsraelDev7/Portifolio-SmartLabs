import React, { useRef } from 'react';
import Hero from '../sections/Hero';
import SceneSection from '../sections/SceneSection';
import { usePageMotion } from '../hooks/usePageMotion';
import { useDeriva } from '../hooks/useDeriva';
import { useBlocos } from '../hooks/useBlocos';
import Mosaico from '../components/Mosaico';
import Moldura from '../components/Moldura';
import Modulo from '../components/Modulo';
import Camadas from '../sections/Camadas';

/**
 * As cinco pecas da galeria "nao e apenas um site" — as camadas de uma
 * sede digital, da fundacao ao acabamento, com a autoria no meio.
 *
 * `area` e `grid-area: linha-inicio / coluna-inicio / linha-fim /
 * coluna-fim` na grade de 12 colunas por linhas de 2vw definida no CSS.
 * Os retangulos NAO sao arbitrarios: cada um foi calculado para bater
 * com a proporcao do arquivo, senao o `object-fit: cover` corta a peca.
 * Com coluna de 6.217vw e vao de 1.4vw:
 *
 *   estrutura  5 col = 36.7vw x 18 lin = 36.0vw -> 1.02  (arquivo 1:1)
 *   estetica   2 col = 13.8vw x  9 lin = 18.0vw -> 0.77  (arquivo 0.75)
 *   interface  3 col = 21.5vw x 11 lin = 22.0vw -> 0.98  (arquivo 1:1)
 *   arquiteto  7 col = 51.9vw x 15 lin = 30.0vw -> 1.73  (arquivo 1.76)
 *   motor      4 col = 29.1vw x 11 lin = 22.0vw -> 1.32  (arquivo 1.33)
 *
 * A ordem do array e a ordem de LEITURA (topo para baixo), nao a da
 * composicao visual — quem navega por teclado ou leitor de tela percorre
 * as pecas na ordem em que elas aparecem na pagina.
 *
 * `deriva` e o fator do useDeriva, e o alcance dele NAO e intuitivo: o
 * curso vale (altura do cartao + altura da viewport), entao -0.12 num
 * cartao de 250px numa tela de 818 desloca 128px — quase a folga inteira
 * que o MOTOR tem acima dele. Foi medido: com -0.12 o cartao invadia o
 * rotulo da ESTRUTURA. Os fatores aqui estao dimensionados contra a
 * folga real de cada peca, nao escolhidos por gosto.
 */
const SEDE = [
  {
    id: 'estrutura',
    area: '1 / 1 / 19 / 6',
    imagem: '/images/camada-estrutura.jpg',
    alt: 'Maquete de concreto de um edificio, com a malha estrutural desenhada em laranja sobre as arestas',
    rotulo: 'ESTRUTURA PRIMEIRO',
    semente: 11,
  },
  {
    id: 'estetica',
    area: '2 / 11 / 11 / 13',
    imagem: '/images/estetica-depois.jpg',
    alt: 'Escultura de gesso polido com a malha estrutural transparecendo sob a superficie',
    rotulo: 'ESTÉTICA DEPOIS',
    deriva: '-0.06',
    semente: 23,
  },
  {
    id: 'interface',
    area: '6 / 7 / 17 / 10',
    imagem: '/images/camada-interface.jpg',
    alt: 'Paineis de vidro suspensos com marcacoes de interface, atravessados por luz ambar',
    rotulo: 'INTERFACE QUE RESPONDE',
    deriva: '-0.09',
    semente: 41,
  },
  {
    id: 'arquiteto',
    area: '21 / 6 / 36 / 13',
    imagem: '/images/camada-arquiteto.jpg',
    alt: 'Israel Passos de perfil no escuro, o contorno desenhado por uma luz ambar',
    rotulo: 'TEM UM ARQUITETO',
    semente: 59,
  },
  {
    id: 'motor',
    area: '24 / 1 / 35 / 5',
    imagem: '/images/work-automacao.jpg',
    alt: 'Mecanismo de placas metalicas com luz ambar correndo entre elas',
    rotulo: 'MOTOR POR DENTRO',
    deriva: '-0.05',
    semente: 73,
  },
];

export default function Home() {
  const motionRef = usePageMotion();

  /* Escopo proprio para a deriva, comecando DEPOIS do heroi: o Hero ja
     tem o dele, e um escopo que englobasse os dois faria dois tickers
     escreverem o mesmo `y` nos mesmos elementos. */
  const derivaRef = useRef(null);
  useDeriva(derivaRef);
  useBlocos(derivaRef);

  return (
    <div ref={motionRef} className="page-home" style={{ backgroundColor: '#000' }}>
      <Hero />

      <div ref={derivaRef}>
      
      {/* SECTION 2: EDITORIAL BLOCK */}
      <section style={{ backgroundColor: '#000', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ flex: '1 1 50%', minHeight: '50vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Image Placeholder */}
            {/* Contramao na deriva (+0.14) e revelacao em ladrilhos pelo
                scroll. Saiu o data-anim="frame": o clip e o mosaico
                seriam duas revelacoes disputando a mesma imagem. */}
            <Mosaico deriva="0.14" semente={3} style={{ width: '70%', height: '80%' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#111', backgroundImage: 'url(/images/imagine-alguem.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.8)' }}></div>
            </Mosaico>
          </div>
          <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', padding: '5vw' }}>
            <h2 data-anim="words" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', textTransform: 'uppercase', color: 'var(--text-color)', letterSpacing: '-0.02em' }}>
              Imagine alguém chegando pela primeira vez ao seu negócio. Essa pessoa não conhece você. Ela só consegue julgar aquilo que vê.
            </h2>
          </div>
        </div>
        {/* A deriva vai no container, nao no h3: o data-anim="words" ja
            mexe nas palavras dele. */}
        <div data-deriva="-0.12" style={{ padding: '5vw', paddingBottom: '10vw' }}>
          <h3 data-anim="words" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4.5vw, 5rem)', lineHeight: '0.9', textTransform: 'uppercase', color: 'var(--fumaca)', letterSpacing: '-0.02em' }}>
            SEU SITE É UMA DESSAS PRIMEIRAS IMPRESSÕES. ELE NÃO DEVERIA SER APENAS UMA PÁGINA BONITA. DEVERIA REPRESENTAR O NÍVEL DO NEGÓCIO POR TRÁS.
          </h3>
        </div>
      </section>

      {/* SECTION 3: GREEN TEXT + MASONRY GALLERY */}
      <section style={{ backgroundColor: '#000', padding: '15vw 5vw' }}>
        <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '0.85', color: 'var(--cal)', textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '-0.03em' }}>
          NÃO É APENAS<br/>UM SITE.
        </h2>
        <p data-anim="rise" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: '#fff', maxWidth: '800px', lineHeight: '1.5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          É A SEDE DIGITAL DA SUA EMPRESA. O RESULTADO É UMA PRESENÇA DIGITAL SOFISTICADA, ESTRATÉGICA E PREPARADA PARA CRESCER.
        </p>
        
        {/* ── As camadas de uma sede digital ──
            Cinco pecas de tamanhos deliberadamente diferentes, em dois
            andares que se ENTRELACAM: B e D correm ao lado de A, e E ao
            lado de C. E o entrelacamento que segura a altura — empilhadas,
            as mesmas cinco pecas passariam de 110vw; assim ficam em 72.

            Sem `data-bloco` aqui, de proposito. Aquele hook usa UM gatilho
            para o grupo inteiro, e num bloco de 72vw as pecas de baixo
            disparariam a ~1150px numa viewport de 818 — animando fora da
            tela, o mesmo defeito ja corrigido no rodape. E somar
            slide+clipPath por cima do Mosaico e a mesma colisao de duas
            animacoes que apagou o terceiro cartao da versao anterior.
            Aqui a GERACAO EM PIXEL e a entrada, e cada peca tem o seu
            proprio gatilho, dentro do proprio Mosaico.

            A deriva vai na PECA, nao no Mosaico: assim a foto e o seu
            rotulo sobem juntos. Na versao anterior ela morava no Mosaico
            para nao brigar com o `y` que o data-bloco do pai escrevia —
            sem o data-bloco essa razao acabou, e mante-la la deixaria o
            rotulo para tras, abrindo uma lacuna do tamanho do
            deslocamento entre a foto e o nome dela.

            Sem `grayscale` tambem: tres destas imagens trazem o Solda
            nativo — o contorno do retrato, o wireframe da maquete, a luz
            atravessando os paineis. O filtro matava exatamente o que faz
            elas serem da marca. As outras duas ja sao P&B no arquivo,
            entao nada muda nelas. */}
        <div className="sede">
          {SEDE.map((c) => (
            <figure className="sede__peca" style={{ gridArea: c.area }} data-deriva={c.deriva} key={c.id}>
              <Mosaico className="sede__caixa" semente={c.semente}>
                <img src={c.imagem} alt={c.alt} />
              </Mosaico>
              <figcaption className="sede__rotulo">{c.rotulo} (2026)</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* SECTION 3.5: CENA 3D — O Monolito dos Degraus (motion-system S02) */}
      <SceneSection />

      {/* SECTION 4: SPLIT HERO (O QUE EU CONSTRUO) */}
      <section style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: '#000', borderTop: '1px solid #222' }}>
        {/* Left Half */}
        {/* A metade da imagem gruda no topo; a coluna de texto sobe por
            cima dela. E o "travar a tela": a foto para, o conteudo passa.
            alignSelf flex-start e obrigatorio — em flex o padrao estica o
            item para a altura toda e sticky nunca chega a grudar. */}
        <div style={{ flex: '1 1 50%', padding: '5vw', position: 'sticky', top: 0, alignSelf: 'flex-start', borderRight: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>
            <span>SMARTLABS —— // BUILD</span>
            <span>REVISION —— NEUE 1.0</span>
          </div>
          <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 8vw, 10rem)', lineHeight: '0.85', color: '#fff', textTransform: 'uppercase', marginBottom: '5vw' }}>
            O QUE EU<br/>CONSTRUO
          </h2>
          <Mosaico semente={17} style={{ width: '100%', height: '60vh' }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/images/o-que-construo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.9)' }}></div>
          </Mosaico>
        </div>
        
        {/* Right Half — sobe POR CIMA da imagem grudada */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
          {/* Top Grey Box */}
          <div style={{ backgroundColor: '#111', padding: '5vw', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', color: '#fff', textTransform: 'uppercase' }}>EXPERIÊNCIA</h3>
            <h4 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 4rem)', lineHeight: '0.9', color: '#555', textTransform: 'uppercase', marginBottom: '3rem' }}>DE ALTO PADRÃO</h4>
            
            <div data-bloco style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.5', color: '#aaa', textTransform: 'uppercase' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>01 — IDENTIDADE & UX</div>
                Sua marca precisa ser percebida antes mesmo de ser explicada. Construo e organizo a identidade visual e a experiência digital para transmitir posicionamento, confiança e valor.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>02 — WEBSITES</div>
                Não trabalho para simplesmente colocar sua empresa na internet. Construo uma presença digital pensada para conduzir o visitante e transformar atenção em ação.
              </div>
            </div>
          </div>
          
          {/* Bottom Black Box */}
          <div style={{ backgroundColor: '#050505', padding: '5vw', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '1px solid #222' }}>
            <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', color: '#fff', textTransform: 'uppercase' }}>OPERAÇÃO</h3>
            <h4 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 4rem)', lineHeight: '0.9', color: '#555', textTransform: 'uppercase', marginBottom: '3rem' }}>INTELIGENTE</h4>
            
            <div data-bloco style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.5', color: '#aaa', textTransform: 'uppercase' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>03 — AUTOMAÇÃO & IA</div>
                A parte que o cliente vê é apenas metade do projeto. Automatizo operações para reduzir tarefas manuais, acelerar respostas e criar processos mais eficientes.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>04 — SEGURANÇA</div>
                Um negócio de alto nível precisa de uma fundação à altura. Por isso, segurança não é um detalhe colocado no final do projeto. É considerada desde a arquitetura.
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 5: MODULES ROW (THE SYSTEM) */}
      <section style={{ backgroundColor: '#000', color: '#fff', padding: '10vw 5vw', borderTop: '1px solid #222' }}>
        <Moldura style={{ padding: 'clamp(2.5rem, 6vw, 6rem) clamp(1.5rem, 4vw, 4rem)', marginBottom: '6vw' }}>
          <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 8rem)', lineHeight: '0.9', textTransform: 'uppercase', color: '#fff', margin: 0, textAlign: 'left' }}>
            O SISTEMA ESTÁ CONECTADO.
          </h2>
          <p data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 3rem)', lineHeight: '1', textTransform: 'uppercase', color: 'var(--fumaca)', margin: 'var(--space-3) 0 0', letterSpacing: '-0.01em' }}>
            Cada camada tem uma função.
          </p>
          <div className="moldura__rodape">
            <span className="moldura__pasta">
              <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
                <path d="M0.75 10.25V0.75H4.5L5.75 2.25H12.25V10.25H0.75Z" stroke="var(--solda)" strokeWidth="1" />
              </svg>
              SML/IP —— 2026
            </span>
            <span>SOURCE —— THE SYSTEM</span>
          </div>
        </Moldura>
        
        <div data-bloco>
          <Modulo
            codigo="01" titulo="Design" indice="001"
            destaque="A primeira impressão importa."
            tags="Interface. Experiência. Posicionamento."
          >
            Criamos interfaces que traduzem posicionamento, elevam percepção de valor e tornam a experiência digital coerente com o nível do negócio.
          </Modulo>

          <Modulo
            codigo="02" titulo="Development" indice="002"
            destaque="Por trás de uma boa experiência existe uma estrutura sólida."
            tags="Front-end. Back-end. APIs. Sistemas."
          >
            Desenvolvemos aplicações e sistemas com arquitetura full-stack, integrações e tecnologia adequada ao problema.
          </Modulo>

          <Modulo
            codigo="03" titulo="Automation" indice="003"
            destaque="Tudo que depende de trabalho manual repetitivo merece ser questionado."
            tags="Menos tarefas manuais. Mais velocidade."
          >
            Conectamos processos para que informações avancem pelo sistema sem depender de alguém movimentando cada etapa.
          </Modulo>

          <Modulo
            codigo="04" titulo="Data" indice="004"
            destaque="Cada interação pode gerar informação."
            tags="Captura. Organização. Tracking. Informação."
          >
            Estruturamos a captura e organização desses dados para que o negócio consiga entender melhor o que acontece depois que alguém chega.
          </Modulo>

          <Modulo
            codigo="05" titulo="AI" indice="005"
            destaque="Inteligência artificial não precisa ser um efeito. Ela precisa ter uma função."
            tags="IA aplicada. Agentes. Processos inteligentes."
          >
            Criamos e integramos agentes e sistemas inteligentes para atuar dentro de processos reais do negócio.
          </Modulo>

          <Modulo
            codigo="06" titulo="Security" indice="006"
            destaque="Uma estrutura só é realmente boa quando pode ser confiada."
            tags="Segurança não é uma camada adicional. É parte da construção."
          >
            Segurança faz parte da arquitetura desde o início — da proteção de dados às integrações e aos acessos.
          </Modulo>
        </div>
      </section>

      {/* SECTION 6: AS CAMADAS — cinco blocos com rearranjo por Flip */}
      <Camadas />
      </div>
    </div>
  );
}
