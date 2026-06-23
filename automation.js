// zMTypingClub Automation — by Andres
//
// CONFIG:
//   minDelay / maxDelay  — rango de velocidad en ms por tecla
//                          80-200  = rapido con naturalidad
//                          110-215 = velocidad humana comoda
//   enableMistakes       — simular errores humanos (true/false)
//   mistakeChance        — probabilidad de error: 0.03 = 3%, 0.09 = 9%

const CONFIG = {
  minDelay: 80,
  maxDelay: 215,
  enableMistakes: true,
  mistakeChance: 0.03,
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function detectGame() {
  if (window.Phaser?.GAMES?.[0]?.world) return 'globos';
  if (document.querySelector('.token .token_unit')) return 'token';

  const selectors = [
    '#words .word .letter',
    '.TextLines-module span',
    '.token span',
    '.letters span',
    '[class*="word"] [class*="letter"]',
    '[class*="word"] span',
    '[class*="char"]',
    '[class*="letter"]',
  ];

  for (const sel of selectors) {
    const chars = [...document.querySelectorAll(sel)].filter(
      el => el.children.length === 0 && el.textContent.trim().length === 1
    );
    if (chars.length > 5) return 'generic:' + sel;
  }

  return null;
}

function getTextToken() {
  return [...document.querySelectorAll('.token .token_unit')]
    .map(el => {
      if (el.firstChild?.classList?.contains('_enter')) return '\n';
      let chr = el.textContent?.[0] || '';
      if (chr.charCodeAt?.(0) === 160) chr = ' ';
      return chr;
    })
    .join('');
}

function getTextGeneric(selector) {
  return [...document.querySelectorAll(selector)]
    .filter(el => el.children.length === 0 && el.textContent.trim().length === 1)
    .map(el => el.textContent)
    .join('');
}

async function leerGlobos() {
  const excluidos = ['balloon-count', 'balloon-glow', 'balloon-ray', 'balloon-cursor'];
  const game = Phaser.GAMES[0];
  return game.world.children
    .filter(x => {
      const key = String(x.key || '');
      return key.includes('balloon-') && x.children?.[0]?.text && !excluidos.includes(key);
    })
    .sort((a, b) => (a.x ?? a.position?.x ?? 0) - (b.x ?? b.position?.x ?? 0))
    .map(x => x.children[0].text)
    .join('');
}

function humanDelay(char, pos, total) {
  let base = CONFIG.minDelay + Math.random() * (CONFIG.maxDelay - CONFIG.minDelay);
  if (pos < 3) base *= 1.8;
  if ([' ', '.', ',', '!', '?'].includes(char)) base *= 1.5;
  if (Math.random() < 0.08) base += 150 + Math.random() * 200;
  if (pos > 3 && pos < total - 3) base *= 0.9;
  return base;
}

function getWrongKey(correct) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let wrong;
  do { wrong = letters[Math.floor(Math.random() * letters.length)]; }
  while (wrong.toLowerCase() === correct.toLowerCase());
  return wrong;
}

async function typeKey(input, key, nativeSetter) {
  const isEnter = key === '\n';

  input.dispatchEvent(new KeyboardEvent('keydown', {
    key:     isEnter ? 'Enter' : key,
    code:    isEnter ? 'Enter' : key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
    keyCode: isEnter ? 13 : key.charCodeAt(0),
    which:   isEnter ? 13 : key.charCodeAt(0),
    bubbles: true, cancelable: true,
  }));

  if (!isEnter) {
    if (nativeSetter) nativeSetter.call(input, input.value + key);
    else input.value += key;
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true, cancelable: true,
      data: key, inputType: 'insertText',
    }));
  } else {
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true, data: null, inputType: 'insertLineBreak',
    }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  input.dispatchEvent(new KeyboardEvent('keyup', {
    key:  isEnter ? 'Enter' : key,
    code: isEnter ? 'Enter' : key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
    bubbles: true,
  }));

  input.value = '';
}

async function typeBackspace(input) {
  input.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Backspace', code: 'Backspace',
    keyCode: 8, which: 8,
    bubbles: true, cancelable: true,
  }));
  input.dispatchEvent(new InputEvent('input', {
    bubbles: true, cancelable: true,
    data: null, inputType: 'deleteContentBackward',
  }));
  input.dispatchEvent(new KeyboardEvent('keyup', {
    key: 'Backspace', code: 'Backspace', bubbles: true,
  }));
  input.value = '';
}

async function runStandard(input, text, nativeSetter) {
  for (let i = 0; i < text.length; i++) {
    const key = text[i];
    const shouldFail =
      CONFIG.enableMistakes &&
      key !== '\n' && key !== ' ' &&
      Math.random() < CONFIG.mistakeChance;

    if (shouldFail) {
      await typeKey(input, getWrongKey(key), nativeSetter);
      await sleep(80 + Math.random() * 100);
      await typeBackspace(input);
      await sleep(60 + Math.random() * 80);
    }

    await typeKey(input, key, nativeSetter);
    await sleep(humanDelay(key, i, text.length));
  }
}

async function runGlobos(input, nativeSetter) {
  let textoCompleto = '';
  let letrasEscritas = 0;
  let sinCambios = 0;

  if (nativeSetter) nativeSetter.call(input, '');
  else input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
  await sleep(400 + Math.random() * 600);

  while (true) {
    const ventana = await leerGlobos();

    if (!ventana) {
      if (++sinCambios > 5) break;
      await sleep(300);
      continue;
    }
    sinCambios = 0;

    if (!textoCompleto) {
      textoCompleto = ventana;
    } else {
      let overlap = 0;
      for (let i = Math.min(textoCompleto.length, ventana.length); i > 0; i--) {
        if (textoCompleto.slice(-i) === ventana.slice(0, i)) { overlap = i; break; }
      }
      const nuevo = ventana.slice(overlap);
      if (nuevo) textoCompleto += nuevo;
    }

    while (letrasEscritas < textoCompleto.length) {
      const letra = textoCompleto[letrasEscritas];
      await typeKey(input, letra, nativeSetter);
      letrasEscritas++;
      await sleep(humanDelay(letra, letrasEscritas, textoCompleto.length));
    }

    await sleep(80);
  }
}

async function run() {
  const input = document.querySelector('input');
  if (!input) { console.error('Input no encontrado'); return; }

  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  )?.set;

  const game = detectGame();
  if (!game) { console.error('Juego no reconocido'); return; }

  input.focus();

  if (game === 'globos') {
    while (true) {
      await runGlobos(input, nativeSetter);
      await sleep(800 + Math.random() * 400);
    }
  } else {
    const text = game === 'token' ? getTextToken() : getTextGeneric(game.split(':')[1]);
    if (!text) { console.error('No se pudo leer el texto'); return; }
    await runStandard(input, text, nativeSetter);
  }
}

run();
