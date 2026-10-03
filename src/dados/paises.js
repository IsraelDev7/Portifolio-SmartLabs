/**
 * Os países que o formulário aceita, e o código de discagem de cada um.
 *
 * ── por que esta lista existe ──
 * Quase ninguém digita o código do país no campo de telefone. Um brasileiro
 * escreve "62 99999-8888" e pronto. Sem saber de onde a pessoa fala, não há
 * como montar um número discável — e foi exatamente isso que fez a perna da
 * ligação precisar adivinhar.
 *
 * Com o país escolhido na mão, o número vira E.164 por construção, e não por
 * palpite. De quebra, a localização deixa de ser deduzida: ela é declarada.
 *
 * ── por que sem bandeirinha ──
 * Emoji de bandeira não renderiza no Windows: 🇧🇷 vira as letras "BR" na
 * tela. Um seletor que parece certo no Mac e quebrado no Windows é pior que
 * um seletor sem enfeite. O código de discagem já é a informação útil.
 *
 * ── por que o Brasil vem primeiro e pré-selecionado ──
 * É de onde vem quase todo o contato. Lista alfabética pura obrigaria a
 * maioria a rolar até o B toda vez.
 */

/** Grupos na ordem em que aparecem no seletor. */
export const GRUPOS = [
  'América do Sul',
  'América do Norte e Central',
  'União Europeia',
  'Reino Unido',
];

export const PAISES = [
  /* ── América do Sul ── */
  { iso: 'BR', nome: 'Brasil',             ddi: '55',  grupo: 'América do Sul' },
  { iso: 'AR', nome: 'Argentina',          ddi: '54',  grupo: 'América do Sul' },
  { iso: 'BO', nome: 'Bolívia',            ddi: '591', grupo: 'América do Sul' },
  { iso: 'CL', nome: 'Chile',              ddi: '56',  grupo: 'América do Sul' },
  { iso: 'CO', nome: 'Colômbia',           ddi: '57',  grupo: 'América do Sul' },
  { iso: 'EC', nome: 'Equador',            ddi: '593', grupo: 'América do Sul' },
  { iso: 'PY', nome: 'Paraguai',           ddi: '595', grupo: 'América do Sul' },
  { iso: 'PE', nome: 'Peru',               ddi: '51',  grupo: 'América do Sul' },
  { iso: 'UY', nome: 'Uruguai',            ddi: '598', grupo: 'América do Sul' },
  { iso: 'VE', nome: 'Venezuela',          ddi: '58',  grupo: 'América do Sul' },

  /* ── América do Norte e Central ── */
  { iso: 'US', nome: 'Estados Unidos',     ddi: '1',   grupo: 'América do Norte e Central' },
  { iso: 'CA', nome: 'Canadá',             ddi: '1',   grupo: 'América do Norte e Central' },
  { iso: 'MX', nome: 'México',             ddi: '52',  grupo: 'América do Norte e Central' },
  { iso: 'CR', nome: 'Costa Rica',         ddi: '506', grupo: 'América do Norte e Central' },
  { iso: 'SV', nome: 'El Salvador',        ddi: '503', grupo: 'América do Norte e Central' },
  { iso: 'GT', nome: 'Guatemala',          ddi: '502', grupo: 'América do Norte e Central' },
  { iso: 'HN', nome: 'Honduras',           ddi: '504', grupo: 'América do Norte e Central' },
  { iso: 'NI', nome: 'Nicarágua',          ddi: '505', grupo: 'América do Norte e Central' },
  { iso: 'PA', nome: 'Panamá',             ddi: '507', grupo: 'América do Norte e Central' },

  /* ── União Europeia ── */
  { iso: 'DE', nome: 'Alemanha',           ddi: '49',  grupo: 'União Europeia' },
  { iso: 'AT', nome: 'Áustria',            ddi: '43',  grupo: 'União Europeia' },
  { iso: 'BE', nome: 'Bélgica',            ddi: '32',  grupo: 'União Europeia' },
  { iso: 'BG', nome: 'Bulgária',           ddi: '359', grupo: 'União Europeia' },
  { iso: 'CY', nome: 'Chipre',             ddi: '357', grupo: 'União Europeia' },
  { iso: 'HR', nome: 'Croácia',            ddi: '385', grupo: 'União Europeia' },
  { iso: 'DK', nome: 'Dinamarca',          ddi: '45',  grupo: 'União Europeia' },
  { iso: 'SK', nome: 'Eslováquia',         ddi: '421', grupo: 'União Europeia' },
  { iso: 'SI', nome: 'Eslovênia',          ddi: '386', grupo: 'União Europeia' },
  { iso: 'ES', nome: 'Espanha',            ddi: '34',  grupo: 'União Europeia' },
  { iso: 'EE', nome: 'Estônia',            ddi: '372', grupo: 'União Europeia' },
  { iso: 'FI', nome: 'Finlândia',          ddi: '358', grupo: 'União Europeia' },
  { iso: 'FR', nome: 'França',             ddi: '33',  grupo: 'União Europeia' },
  { iso: 'GR', nome: 'Grécia',             ddi: '30',  grupo: 'União Europeia' },
  { iso: 'HU', nome: 'Hungria',            ddi: '36',  grupo: 'União Europeia' },
  { iso: 'IE', nome: 'Irlanda',            ddi: '353', grupo: 'União Europeia' },
  { iso: 'IT', nome: 'Itália',             ddi: '39',  grupo: 'União Europeia' },
  { iso: 'LV', nome: 'Letônia',            ddi: '371', grupo: 'União Europeia' },
  { iso: 'LT', nome: 'Lituânia',           ddi: '370', grupo: 'União Europeia' },
  { iso: 'LU', nome: 'Luxemburgo',         ddi: '352', grupo: 'União Europeia' },
  { iso: 'MT', nome: 'Malta',              ddi: '356', grupo: 'União Europeia' },
  { iso: 'NL', nome: 'Países Baixos',      ddi: '31',  grupo: 'União Europeia' },
  { iso: 'PL', nome: 'Polônia',            ddi: '48',  grupo: 'União Europeia' },
  { iso: 'PT', nome: 'Portugal',           ddi: '351', grupo: 'União Europeia' },
  { iso: 'CZ', nome: 'República Tcheca',   ddi: '420', grupo: 'União Europeia' },
  { iso: 'RO', nome: 'Romênia',            ddi: '40',  grupo: 'União Europeia' },
  { iso: 'SE', nome: 'Suécia',             ddi: '46',  grupo: 'União Europeia' },

  /* ── Reino Unido ── */
  { iso: 'GB', nome: 'Reino Unido',        ddi: '44',  grupo: 'Reino Unido' },
];

/** ISO → código de discagem. É o que transforma o que foi digitado em E.164. */
export const DDI_POR_ISO = Object.fromEntries(PAISES.map((p) => [p.iso, p.ddi]));

export const PAIS_PADRAO = 'BR';
