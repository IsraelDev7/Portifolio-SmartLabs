/**
 * Quando a cortina do preloader termina de subir.
 *
 * Vem da linha do tempo do Preloader: 1s de texto + 0,5s de pausa + 1,2s
 * de cortina. Peca com gatilho de scroll que ja nasce visivel dispara na
 * montagem — atras da cortina — e quem chega depois so encontra o estado
 * final. Adiar a criacao do gatilho ate aqui e o que faz a primeira
 * animacao da pagina ser vista.
 *
 * Mora num modulo proprio porque mais de um componente precisa do mesmo
 * instante: tres copias do mesmo numero magico divergem no dia em que a
 * duracao do preloader mudar.
 *
 * A Navbar tem o seu proprio alvo, menor de proposito: la o logo deve
 * estar SE MONTANDO enquanto a cortina passa, nao depois dela.
 */
export const ALVO_CORTINA = 2700;

/**
 * Roda `fn` quando a cortina tiver saido — imediatamente, se ja saiu.
 * Devolve a funcao de cancelamento.
 *
 * performance.now(), nao um contador de "primeira vez": o <StrictMode>
 * invoca os efeitos duas vezes e a segunda passada consumiria a flag,
 * disparando cedo demais. O relogio nao se engana.
 */
export function aposCortina(fn) {
  const t = window.setTimeout(fn, Math.max(0, ALVO_CORTINA - performance.now()));
  return () => window.clearTimeout(t);
}
