# Portfólio Smart LABS — Israel Passos

Portfólio construído como demonstração do padrão que entra em cada projeto de
cliente. O argumento não está no texto da página: está no **método** — e o
histórico deste repositório é a prova dele.

**Stack:** React 19 · Vite · GSAP + ScrollTrigger · Lenis · Three.js / R3F
**81 commits**, todos em Conventional Commits, com o raciocínio de cada
decisão escrito dentro da mensagem.

---

## Por que este repositório existe

Todo portfólio de desenvolvedor mostra o resultado. Quase nenhum mostra
**como se chega nele** — e é exatamente aí que a diferença entre bonito e
confiável aparece.

Aqui o histórico é parte do produto. Cada correção registra o que quebrou, o
número que provou que quebrou, e por que a solução escolhida foi aquela.
Quem abrir `git log` lê um caderno de obra, não uma lista de "update".

---

## As três ideias que sustentam a página

### 1. Tipografia medida em tempo de execução

A referência do projeto enche a largura da coluna com cada linha de texto —
corpos diferentes por linha, todas medindo o mesmo. A forma óbvia de copiar
isso é fixar tamanhos em `vw` e calibrar no olho.

Isso falha no primeiro quadro. Antes da fonte carregar, o navegador desenha
com a reserva, que é mais larga; com `white-space: nowrap`, o texto não
quebra — vaza pela borda. É o corte que aparecia nas letras finais.

O `useCorpoJusto` mede o texto real e calcula o corpo para a linha encher a
largura disponível:

```js
el.style.setProperty('font-size', BASE + 'px', 'important');
const largura = el.scrollWidth;                    // largura REAL do texto
el.style.setProperty('font-size', ((alvo / largura) * BASE) + 'px', 'important');
```

Três detalhes que só apareceram medindo:

- **`scrollWidth`, não `getBoundingClientRect`.** O rect já vem somado dos
  `transform` que as animações aplicam — mediria a largura *animada*.
- **`clientWidth` inclui o padding.** Usá-lo cru dava um alvo 40px maior que o
  real, e a linha vazava.
- **O `ResizeObserver` precisa de guarda de largura.** Sem ela: o hook escreve
  o corpo, a linha muda de altura, o container muda, o observer dispara, o
  hook escreve de novo — laço infinito que travava o navegador.

### 2. Verificação por medição, não por screenshot

Nenhuma correção deste projeto foi aprovada "no olho". A régua é numérica:

| O que se mede | Onde isso pegou um defeito real |
|---|---|
| Rolagem horizontal em 4 larguras | Um item flex inflando de 746 para 1002px |
| Colisão entre elementos, em pixels | Sobreposição de 176×83px entre a declaração e o rodapé |
| Estado de repouso dos tweens | Animação que nascia aberta por ordem de criação errada |

Screenshot mostra que *parece* certo. Medição mostra que *está* certo — e
foi medindo que apareceram defeitos invisíveis à inspeção.

### 3. Movimento que carrega argumento

A régua é simples: **se apagar a animação e a página continuar dizendo a mesma
coisa, aquela animação era enfeite.** Enfeite pesa, esquenta celular e cansa.

Na seção de Development, a foto congela e o texto sobe por cima dela. A imagem
parada é a estrutura; o texto que passa é o que muda. É a tese da página
contada em dez segundos de rolagem, sem uma linha de legenda explicando.

---

## Três bugs que valem mais que o código que sobrou

### `flex: 0 0 52%` não fixa o mínimo

Com as linhas em `white-space: nowrap`, o texto entrou no *min-content* do
item flex. `flex-basis` fixa a **base**, não o **mínimo**: todo item flex
nasce com `min-width: auto`, que é o tamanho mínimo do conteúdo. A coluna foi
de 746 para 1002px, empurrou o painel para fora e criou barra horizontal.

A saída não foi `min-width: 0` — foi `position: absolute`. **Elemento fora do
fluxo não entra no min-content de ninguém.** O transbordo deixou de ser
problema de layout e virou o que sempre deveria ter sido: pintura.

### Media query não soma especificidade

Uma regra base escrita depois de uma media query vence a regra dentro dela:
as duas empatam em especificidade, e o desempate é a ordem no arquivo. Uma
peça desaparecia do celular por causa disso.

A correção não foi `!important` — foi escrever a regra como
`@media (min-width: 821px)`. Aí ela **deixa de existir** no telefone em vez
de competir lá. Regra que não existe não vaza.

### A ordem de criação de dois tweens decide o estado de repouso

Entrada e saída passaram a escrever nas mesmas propriedades dos mesmos
elementos. Um `fromTo` sob ScrollTrigger grava o estado inicial **no ato da
criação** — então, criada por último, a saída deixava o texto visível antes
do próprio gatilho.

Criando a saída primeiro, a entrada — que nasce fechada — fica com a última
palavra. `immediateRender: false` diz a mesma coisa por outro caminho; os dois
juntos porque cada um sozinho depende de detalhe de implementação.

---

## Acessibilidade e desempenho

Tratados como alcance, não como caridade:

- Alvo de toque com tamanho mínimo em toda a navegação (WCAG 2.5.5)
- Contraste verificado em texto sobre imagem — daí as três sombras empilhadas
  no fecho sobre as ondas
- `prefers-reduced-motion` com **caminho estático de verdade**: não é
  animação mais lenta, é conteúdo pronto
- Zero rolagem horizontal, medido em 414, 900, 1440 e 1920px

---

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

---

## Estrutura

```
src/
  hooks/
    useCorpoJusto.js    tipografia medida em tempo de execução
    usePageMotion.js    motor de movimento por atributo data-anim
    useLenis.js         rolagem suave
    useBlocos.js · useDeriva.js · useLogoPixel.js · useScrubWords.jsx
  components/
    Cisao · Ondas · Persiana · Mosaico · Modulo · Nivel
    MenuMovel · Navbar · Esteira · Vitrine · Firma
    TransitionLink · SliceCurtain · MaskReveal
  sections/
    Hero · Manifesto · Camadas · ProcessoServicos
    Assinatura · Projetos · SceneSection · Preloader · Footer
  pages/
    Home · Work · About · Thoughts · Contact · Legal · 404
```

### O gerador determinístico

Mosaico, Persiana e Ondas compartilham o mesmo LCG com semente fixa:

```js
s = (s * 1664525 + 1013904223) % 4294967296;
```

Com `Math.random`, o desenho mudaria a cada remedição e o olho pega isso como
cintilação. A semente fixa dá às peças uma identidade estável.

---

## Limites conhecidos

- **Sem teste automatizado.** O primeiro que vale escrever é o do
  `useCorpoJusto`: entrada de largura conhecida, corpo esperado. É lógica
  pura e é a peça mais reaproveitada do projeto.
- **Sem CI.** O selo verde faz um trabalho desproporcional ao esforço — diz
  "isto roda" antes de qualquer pessoa clonar.
- **A home não tem `<h1>`.** Detalhe de semântica que pesa em busca.
- **Conteúdo provisório** em Work e Thoughts: nomes, datas e depoimentos
  ainda são preenchimento. Não filmar em close até a copy final entrar.

---

## Direitos

O código é referência de estudo. A identidade visual, os textos e as imagens
são da Smart LABS e não estão licenciados para reuso.

---

Construído por [Israel Passos](https://github.com/IsraelDev7) · Smart LABS
