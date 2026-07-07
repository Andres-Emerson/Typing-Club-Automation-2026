(function () {
    'use strict';
    if (window.typingClubBot) {
        console.log('zMBot already running! Close it first with: window.typingClubBot.close()');
        return;
    }

    console.log('Loading Typing Club zMBot v5.0...');

    const gui = document.createElement('div');
    gui.id = 'typing-bot-gui';

    gui.style.cssText = `
       position: fixed;
       top: 24px;
       right: 24px;
       width: 320px;
       max-width: calc(100vw - 48px);
       background: rgba(10, 12, 20, 0.75);
       backdrop-filter: blur(12px) saturate(1.2);
       -webkit-backdrop-filter: blur(12px) saturate(1.2);
       border: 1px solid rgba(255, 255, 255, 0.06);
       border-radius: 20px;
       box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03);
       z-index: 2147483647;
       font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
       color: rgba(255, 255, 255, 0.85);
       overflow: hidden;
       transition: all 0.3s ease;
       opacity: 0.3;
       transform: scale(0.97);
   `;

    gui.addEventListener('mouseenter', () => {
        gui.style.opacity = '1';
        gui.style.transform = 'scale(1)';
        gui.style.background = 'rgba(10, 12, 20, 0.85)';
        gui.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });

    gui.addEventListener('mouseleave', () => {
        if (!gui.dataset.pinned) {
            gui.style.opacity = '0.3';
            gui.style.transform = 'scale(0.97)';
            gui.style.background = 'rgba(10, 12, 20, 0.75)';
            gui.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }
    });

    gui.innerHTML = `
   <div id="bot-header" style="
       padding: 14px 20px;
       background: rgba(255, 255, 255, 0.03);
       border-bottom: 1px solid rgba(255, 255, 255, 0.04);
       cursor: move;
       display: flex;
       justify-content: space-between;
       align-items: center;
       font-weight: 600;
       font-size: 10px;
       letter-spacing: 0.8px;
       user-select: none;
       text-transform: uppercase;
   ">
       <span style="background: linear-gradient(135deg, #8f8cff, #6a7aff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">zMBot By Andres</span>
       <span id="bot-close" style="
           cursor: pointer;
           font-size: 20px;
           line-height: 1;
           opacity: 0.4;
           transition: all 0.3s;
           color: #fff;
           -webkit-text-fill-color: #fff;
           transform: rotate(0deg);
       ">&times;</span>
   </div>

   <div style="padding: 18px 22px 22px;">
       <!-- Detected -->
       <div style="
           background: rgba(0, 0, 0, 0.2);
           padding: 8px 14px;
           border-radius: 10px;
           margin-bottom: 14px;
           display: flex;
           align-items: center;
           justify-content: space-between;
       ">
           <span style="font-size: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.4;">Level</span>
           <span id="level-info" style="font-weight: 400; font-size: 11px; color: #c8c4ff; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Ready</span>
       </div>

       <!-- Speed -->
       <div style="margin-bottom: 12px;">
           <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
               <label style="font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; opacity: 0.4;">Speed</label>
               <span style="font-size: 14px; font-weight: 600; color: #b8b0ff;"><span id="speed-value">70</span><span style="font-size: 10px; font-weight: 400; opacity: 0.4; margin-left: 2px;">WPM</span></span>
           </div>
           <input type="range" id="speed-slider" min="30" max="190" value="70" style="
               -webkit-appearance: none;
               appearance: none;
               width: 100%;
               height: 3px;
               border-radius: 3px;
               outline: none;
               cursor: pointer;
               background: rgba(255, 255, 255, 0.08);
               transition: background 0.2s;
               accent-color: #6a7aff;
           ">
       </div>

       <!-- Accuracy -->
       <div style="margin-bottom: 12px;">
           <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
               <label style="font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; opacity: 0.4;">Accuracy</label>
               <span style="font-size: 14px; font-weight: 600; color: #b8b0ff;"><span id="accuracy-value">97</span><span style="font-size: 10px; font-weight: 400; opacity: 0.4; margin-left: 2px;">%</span></span>
           </div>
           <input type="range" id="accuracy-slider" min="92" max="100" value="97" style="
               -webkit-appearance: none;
               appearance: none;
               width: 100%;
               height: 3px;
               border-radius: 3px;
               outline: none;
               cursor: pointer;
               background: rgba(255, 255, 255, 0.08);
               transition: background 0.2s;
               accent-color: #6a7aff;
           ">
       </div>

       <!-- Auto-advance -->
       <div style="
           display: flex;
           align-items: center;
           gap: 10px;
           padding: 8px 14px;
           border-radius: 10px;
           background: rgba(255, 255, 255, 0.02);
           border: 1px solid rgba(255, 255, 255, 0.04);
           margin-bottom: 14px;
       ">
           <input type="checkbox" id="auto-advance" checked style="
               -webkit-appearance: none;
               appearance: none;
               width: 17px;
               height: 17px;
               border-radius: 5px;
               border: 2px solid rgba(255, 255, 255, 0.15);
               background: rgba(255, 255, 255, 0.03);
               cursor: pointer;
               flex-shrink: 0;
               transition: all 0.2s;
               position: relative;
           ">
           <label for="auto-advance" style="cursor: pointer; flex: 1; font-size: 11px; font-weight: 400;">Auto‑advance</label>
       </div>

       <!-- Botones -->
       <button id="start-btn" style="
           width: 100%;
           padding: 12px;
           border: none;
           border-radius: 12px;
           font-size: 12px;
           font-weight: 600;
           cursor: pointer;
           text-transform: uppercase;
           letter-spacing: 0.4px;
           background: linear-gradient(135deg, #2ecc8a, #1aa87a);
           color: white;
           margin-bottom: 6px;
           transition: all 0.3s ease;
           box-shadow: 0 4px 20px rgba(46, 204, 138, 0.2);
       ">▶ Start Bot</button>
       
       <button id="stop-btn" disabled style="
           width: 100%;
           padding: 12px;
           border: none;
           border-radius: 12px;
           font-size: 12px;
           font-weight: 600;
           cursor: pointer;
           text-transform: uppercase;
           letter-spacing: 0.4px;
           background: linear-gradient(135deg, #ff6b6b, #e05050);
           color: white;
           margin-bottom: 14px;
           opacity: 0.3;
           transition: all 0.3s ease;
           box-shadow: 0 4px 20px rgba(255, 107, 107, 0.1);
       ">⏹ Stop</button>

       <!-- Status -->
       <div id="status" style="
           background: rgba(0, 0, 0, 0.15);
           padding: 10px 14px;
           border-radius: 10px;
           text-align: center;
           font-size: 10px;
           font-weight: 500;
           border: 1px solid rgba(255, 255, 255, 0.04);
           letter-spacing: 0.2px;
           color: rgba(255, 255, 255, 0.6);
           min-height: 38px;
           display: flex;
           align-items: center;
           justify-content: center;
       ">○ idle</div>

       <!-- Stats -->
       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
           <div style="
               background: rgba(0, 0, 0, 0.15);
               padding: 12px 8px;
               border-radius: 10px;
               text-align: center;
               border: 1px solid rgba(255, 255, 255, 0.04);
           ">
               <div style="font-size: 22px; font-weight: 700; color: #b8b0ff; line-height: 1.2;" id="chars-typed">0</div>
               <div style="font-size: 8px; opacity: 0.3; margin-top: 3px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;">Chars</div>
           </div>
           <div style="
               background: rgba(0, 0, 0, 0.15);
               padding: 12px 8px;
               border-radius: 10px;
               text-align: center;
               border: 1px solid rgba(255, 255, 255, 0.04);
           ">
               <div style="font-size: 22px; font-weight: 700; color: #b8b0ff; line-height: 1.2;" id="levels-completed">0</div>
               <div style="font-size: 8px; opacity: 0.3; margin-top: 3px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;">Levels</div>
           </div>
       </div>
   </div>
   `;

    // ── Estilos adicionales ──
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
       #typing-bot-gui input[type="range"]::-webkit-slider-thumb {
           -webkit-appearance: none;
           appearance: none;
           width: 16px;
           height: 16px;
           border-radius: 50%;
           background: linear-gradient(135deg, #8f8cff, #6a7aff);
           cursor: pointer;
           border: 2px solid rgba(255, 255, 255, 0.1);
           box-shadow: 0 2px 12px rgba(106, 122, 255, 0.3);
           transition: all 0.2s;
       }
       #typing-bot-gui input[type="range"]::-webkit-slider-thumb:hover {
           transform: scale(1.1);
           box-shadow: 0 4px 20px rgba(106, 122, 255, 0.5);
       }
       #typing-bot-gui input[type="range"]::-moz-range-thumb {
           width: 16px;
           height: 16px;
           border-radius: 50%;
           background: linear-gradient(135deg, #8f8cff, #6a7aff);
           cursor: pointer;
           border: 2px solid rgba(255, 255, 255, 0.1);
       }
       #typing-bot-gui input[type="checkbox"]:checked {
           background: linear-gradient(135deg, #6a7aff, #8f8cff);
           border-color: transparent;
       }
       #typing-bot-gui input[type="checkbox"]:checked::after {
           content: "✓";
           position: absolute;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%);
           color: #fff;
           font-size: 11px;
           font-weight: 700;
       }
       .pulse-dot {
           display: inline-block;
           width: 6px;
           height: 6px;
           border-radius: 50%;
           background: #2ecc8a;
           margin-right: 8px;
           vertical-align: middle;
           animation: pulse-dot 1.4s ease-in-out infinite;
       }
       @keyframes pulse-dot {
           0%, 100% { opacity: 1; transform: scale(1); }
           50% { opacity: 0.3; transform: scale(0.7); }
       }
   `;
    document.head.appendChild(styleSheet);

    document.body.appendChild(gui);

    // ── DOM references ──
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const accuracySlider = document.getElementById('accuracy-slider');
    const accuracyValue = document.getElementById('accuracy-value');
    const autoAdvance = document.getElementById('auto-advance');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const status = document.getElementById('status');
    const levelInfo = document.getElementById('level-info');
    const charsTypedEl = document.getElementById('chars-typed');
    const levelsCompletedEl = document.getElementById('levels-completed');
    const closeBtn = document.getElementById('bot-close');
    const header = document.getElementById('bot-header');

    let botRunning = false;
    let charsTypedCount = 0;
    let levelsCompleted = 0;

    speedSlider.addEventListener('input', (e) => speedValue.textContent = e.target.value);
    accuracySlider.addEventListener('input', (e) => accuracyValue.textContent = e.target.value);

    // ── Draggable ──
    let isDragging = false, initialX, initialY;
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('#bot-close')) return;
        initialX = e.clientX - gui.offsetLeft;
        initialY = e.clientY - gui.offsetTop;
        isDragging = true;
        gui.style.transition = 'none';
        gui.style.opacity = '1';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        gui.style.left = (e.clientX - initialX) + 'px';
        gui.style.top = (e.clientY - initialY) + 'px';
        gui.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            gui.style.transition = '';
            if (!gui.dataset.pinned) {
                gui.style.opacity = '0.3';
            }
        }
    });

    // ── Pin/Unpin con doble click ──
    header.addEventListener('dblclick', () => {
        gui.dataset.pinned = gui.dataset.pinned ? '' : 'true';
        if (gui.dataset.pinned) {
            gui.style.opacity = '1';
            gui.style.transform = 'scale(1)';
            gui.style.background = 'rgba(10, 12, 20, 0.85)';
        } else {
            gui.style.opacity = '0.3';
            gui.style.transform = 'scale(0.97)';
            gui.style.background = 'rgba(10, 12, 20, 0.75)';
        }
    });

    function detectAnchorKey() {
        const overlayKey = document.querySelector('.blackoverlay .keybtn');
        if (overlayKey) {
            const k = overlayKey.textContent.trim().toLowerCase();
            if (k.length === 1) return k;
        }
        try {
            const renderEngine = window.approuter?.lesson?.activity?.render_engine || '';
            if (renderEngine === 'right-anchor') return 'j';
            if (renderEngine === 'left-anchor') return 'f';
        } catch (_) { }
        return null;
    }

    function startHoldingKey(key, targetElement) {
        if (!key) return null;
        const upper = key.toUpperCase();
        const keyCode = key.charCodeAt(0);
        const opts = {
            key,
            code: `Key${upper}`,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window,
        };
        targetElement.dispatchEvent(new KeyboardEvent('keydown', opts));
        const intervalId = setInterval(() => {
            if (!botRunning) return;
            targetElement.dispatchEvent(new KeyboardEvent('keydown', { ...opts, repeat: true }));
        }, 50);
        console.log('Holding anchor key: "' + key + '"');
        return intervalId;
    }

    function stopHoldingKey(key, targetElement, intervalId) {
        if (!key) return;
        if (intervalId !== null) clearInterval(intervalId);
        const upper = key.toUpperCase();
        const keyCode = key.charCodeAt(0);
        targetElement.dispatchEvent(new KeyboardEvent('keyup', {
            key,
            code: `Key${upper}`,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window,
        }));
        console.log('Released anchor key: "' + key + '"');
    }

    async function readBalloons() {
        try {
            const excluded = ['balloon-count', 'balloon-glow', 'balloon-ray', 'balloon-cursor'];
            const game = window.Phaser?.GAMES?.[0];
            if (!game) return null;
            return game.world.children
                .filter(x => {
                    const key = String(x.key || '');
                    return key.includes('balloon-') && x.children?.[0]?.text && !excluded.includes(key);
                })
                .sort((a, b) => (a.x ?? a.position?.x ?? 0) - (b.x ?? b.position?.x ?? 0))
                .map(x => x.children[0].text)
                .join('');
        } catch (_) {
            return null;
        }
    }

    function getNativeSetter() {
        return Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        )?.set;
    }

    function typeCharImproved(char, field, nativeSetter) {
        const isEnter = (char === '\n' || char === '\r');
        const key = isEnter ? 'Enter' : char;
        const code = isEnter ? 'Enter' : (char === ' ' ? 'Space' : 'Key' + char.toUpperCase());
        const keyCode = isEnter ? 13 : char.charCodeAt(0);

        field.dispatchEvent(new KeyboardEvent('keydown', {
            key, code, keyCode, which: keyCode,
            bubbles: true, cancelable: true,
        }));

        if (!isEnter) {
            if (nativeSetter) nativeSetter.call(field, field.value + char);
            else field.value += char;
            field.dispatchEvent(new InputEvent('input', {
                bubbles: true, cancelable: true,
                data: char, inputType: 'insertText',
            }));
        } else {
            field.dispatchEvent(new InputEvent('input', {
                bubbles: true, data: null, inputType: 'insertLineBreak',
            }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }

        field.dispatchEvent(new KeyboardEvent('keyup', {
            key, code,
            bubbles: true,
        }));

        field.value = '';
    }

    function typeBackspaceImproved(field) {
        field.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace', code: 'Backspace',
            keyCode: 8, which: 8,
            bubbles: true, cancelable: true,
        }));
        field.dispatchEvent(new InputEvent('input', {
            bubbles: true, cancelable: true,
            data: null, inputType: 'deleteContentBackward',
        }));
        field.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Backspace', code: 'Backspace', bubbles: true,
        }));
        field.value = '';
    }

    function humanDelayImproved(char, position, total, baseDelay) {
        let base = baseDelay * (0.8 + Math.random() * 0.4);
        if (position < 3) base *= 1.8;
        if ([' ', '.', ',', '!', '?'].includes(char)) base *= 1.5;
        if (Math.random() < 0.08) base += 150 + Math.random() * 200;
        if (position > 3 && position < total - 3) base *= 0.9;
        return base;
    }

    function detectGame() {
        if (window.Phaser?.GAMES?.[0]?.world) return 'balloons';
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
            const chars = document.querySelectorAll(sel);
            const filtered = Array.from(chars).filter(
                el => el.children.length === 0 && el.textContent.trim().length === 1
            );
            if (filtered.length > 5) return 'generic:' + sel;
        }
        return null;
    }

    function detectLevelUnified() {
        if (window.Phaser?.GAMES?.[0]?.world) {
            levelInfo.textContent = 'Game: Balloons';
            return { text: null, type: 'game', gameName: 'balloons' };
        }

        const continueBtn = document.querySelector('.navbar-continue');
        const hasTypable = document.querySelectorAll('div.typable span.token_unit').length > 0
            || document.querySelectorAll('.boxed-line .boxed-char').length > 0;

        if (continueBtn && continueBtn.offsetParent !== null && !hasTypable) {
            levelInfo.textContent = 'Instruction screen';
            return { text: null, type: 'instruction' };
        }

        const boxedChars = document.querySelectorAll('.boxed-line .boxed-char');
        if (boxedChars.length > 0) {
            const text = Array.from(boxedChars).map(el => {
                const t = el.textContent;
                return (t === ' ' || t === '\u00a0') ? ' ' : t;
            }).join('');
            levelInfo.textContent = 'Boxed: ' + text.length + ' chars';
            return { text, type: 'typing' };
        }

        const letters = document.querySelectorAll('div.typable span.token_unit');
        if (letters && letters.length > 0) {
            const text = Array.from(letters).map(s => {
                if (s.querySelector('._enter') || s.querySelector('br')) return '\n';
                if (s.querySelector('i')) return ' ';
                return s.textContent;
            }).join('');
            levelInfo.textContent = text.length + ' chars detected';
            return { text, type: 'typing' };
        }

        const typable = document.querySelector('div.typable');
        if (typable && typable.textContent) {
            const text = typable.textContent.trim().replace(/\s+/g, ' ');
            levelInfo.textContent = text.length + ' chars detected';
            return { text, type: 'typing' };
        }

        try {
            const app = window.approuter?.lesson?.activity?.app;
            if (app && app.startsWith('typing.games.')) {
                const gameName = app.split('.')[2];
                levelInfo.textContent = 'Game: ' + gameName;
                return { text: null, type: 'game', gameName };
            }
        } catch (_) { }

        const gameContainer = document.querySelector('#game canvas, #game');
        if (gameContainer && gameContainer.style.display !== 'none') {
            levelInfo.textContent = 'Game detected';
            return { text: null, type: 'game', gameName: 'unknown' };
        }

        const genericGame = detectGame();
        if (genericGame) {
            const gameName = genericGame.startsWith('generic:') ? 'generic' : genericGame;
            levelInfo.textContent = 'Game: ' + gameName;
            return { text: null, type: 'game', gameName: genericGame };
        }

        return { text: null, type: null };
    }

    const ADJACENT_KEYS = {
        a: ['s', 'q', 'w', 'z'], b: ['v', 'g', 'h', 'n'], c: ['x', 'd', 'f', 'v'],
        d: ['s', 'e', 'r', 'f', 'c', 'x'], e: ['w', 'r', 'd', 's'], f: ['d', 'r', 't', 'g', 'v', 'c'],
        g: ['f', 't', 'y', 'h', 'b', 'v'], h: ['g', 'y', 'u', 'j', 'n', 'b'], i: ['u', 'o', 'k', 'j'],
        j: ['h', 'u', 'i', 'k', 'm', 'n'], k: ['j', 'i', 'o', 'l', 'm'], l: ['k', 'o', 'p', ';'],
        m: ['n', 'j', 'k'], n: ['b', 'h', 'j', 'm'], o: ['i', 'p', 'l', 'k'],
        p: ['o', 'l', ';', '['], q: ['w', 'a'], r: ['e', 't', 'f', 'd'],
        s: ['a', 'w', 'e', 'd', 'x', 'z'], t: ['r', 'y', 'g', 'f'], u: ['y', 'i', 'j', 'h'],
        v: ['c', 'f', 'g', 'b'], w: ['q', 'e', 's', 'a'], x: ['z', 's', 'd', 'c'],
        y: ['t', 'u', 'h', 'g'], z: ['a', 's', 'x'],
        '1': ['2', 'q'], '2': ['1', '3', 'q', 'w'], '3': ['2', '4', 'w', 'e'],
        '4': ['3', '5', 'e', 'r'], '5': ['4', '6', 'r', 't'], '6': ['5', '7', 't', 'y'],
        '7': ['6', '8', 'y', 'u'], '8': ['7', '9', 'u', 'i'], '9': ['8', '0', 'i', 'o'],
        '0': ['9', 'p', 'o'],
        ',': ['m', 'l', '.'], '.': ['l', ',', '/'], '/': ['.', ';', 'l'],
        ';': ['l', "'", 'p', '/'], "'": [';', '[', 'p'],
    };

    function getAdjacentTypo(char) {
        const key = char.toLowerCase();
        const neighbors = ADJACENT_KEYS[key];
        if (!neighbors || neighbors.length === 0) return null;
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        return char !== char.toLowerCase() ? pick.toUpperCase() : pick;
    }

    async function runBalloons(input, nativeSetter) {
        let fullText = '';
        let lettersWritten = 0;
        let noChanges = 0;

        if (nativeSetter) nativeSetter.call(input, '');
        else input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

        const wpm = parseInt(speedSlider.value);
        const baseDelay = 60000 / (wpm * 5);

        while (botRunning) {
            const windowText = await readBalloons();

            if (!windowText) {
                if (++noChanges > 5) break;
                await new Promise(r => setTimeout(r, 300));
                continue;
            }
            noChanges = 0;

            if (!fullText) {
                fullText = windowText;
            } else {
                let overlap = 0;
                for (let i = Math.min(fullText.length, windowText.length); i > 0; i--) {
                    if (fullText.slice(-i) === windowText.slice(0, i)) { overlap = i; break; }
                }
                const newText = windowText.slice(overlap);
                if (newText) fullText += newText;
            }

            while (lettersWritten < fullText.length) {
                if (!botRunning) break;
                const char = fullText[lettersWritten];
                typeCharImproved(char, input, nativeSetter);
                lettersWritten++;
                charsTypedCount++;
                charsTypedEl.textContent = charsTypedCount;
                const delay = humanDelayImproved(char, lettersWritten, fullText.length, baseDelay);
                await new Promise(r => setTimeout(r, delay));
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    async function processTypingGameUnified(gameName) {
        console.log('Typing game detected: ' + gameName);
        status.textContent = 'Game: ' + gameName + '...';

        if (gameName === 'balloons' || (window.Phaser?.GAMES?.[0]?.world)) {
            const input = document.querySelector("body > input[type='text'][aria-hidden='true']")
                || document.querySelector("input[type='text'][aria-hidden='true']")
                || document.querySelector('input');
            if (!input) {
                status.textContent = 'Input not found';
                stopBot();
                return;
            }
            const nativeSetter = getNativeSetter();
            await runBalloons(input, nativeSetter);
            levelsCompleted++;
            levelsCompletedEl.textContent = levelsCompleted;
            status.textContent = 'Game complete!';
            if (autoAdvance.checked) {
                await new Promise(r => setTimeout(r, 4000));
                if (botRunning) processLevelUnified();
            } else {
                stopBot();
            }
            return;
        }

        let lessonWords = [];
        try {
            const PATHS = [
                () => window.approuter?.lesson?.activity?.text,
                () => window.approuter?.details?.lesson_text,
                () => window.approuter?.lesson?.activity?.lesson_text,
                () => window.approuter?.lesson?.details?.lesson_text,
                () => window.approuter?.lesson?.text,
                () => window.approuter?.lesson?.lesson_text,
            ];
            let raw = null;
            for (const fn of PATHS) {
                try { raw = fn(); } catch (_) { }
                if (typeof raw === 'string' && raw.trim().length > 1) break;
                raw = null;
            }
            if (!raw) {
                const seen = new WeakSet();
                const deepFind = (obj, depth) => {
                    if (depth > 4 || !obj || typeof obj !== 'object' || seen.has(obj)) return null;
                    seen.add(obj);
                    if (typeof obj.lesson_text === 'string' && obj.lesson_text.trim()) return obj.lesson_text.trim();
                    for (const k of Object.keys(obj)) {
                        try { const r = deepFind(obj[k], depth + 1); if (r) return r; } catch (_) { }
                    }
                    return null;
                };
                try { raw = deepFind(window.approuter, 0); } catch (_) { }
            }
            if (typeof raw === 'string' && raw.trim()) {
                lessonWords = raw.trim().split(/\s+/).filter(Boolean);
                console.log(lessonWords.length + ' lesson words loaded');
            }
        } catch (_) { }

        const lessonSet = new Set(lessonWords.map(w => w.toLowerCase()));
        const wordQueue = [];
        const recentSeen = new Map();
        const DEDUP_MS = 3500;
        const WORD_RE = /^[a-zA-Z']{1,30}$/;
        const originalFillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
            const word = String(text ?? '').trim();
            if (WORD_RE.test(word)) {
                const lowerWord = word.toLowerCase();
                const now = Date.now();
                const isValid = (lessonSet.size === 0 || lessonSet.has(lowerWord))
                    && (!recentSeen.has(lowerWord) || now - recentSeen.get(lowerWord) > DEDUP_MS);
                if (isValid) {
                    recentSeen.set(lowerWord, now);
                    wordQueue.push(word);
                    console.log('fillText: "' + word + '" (q=' + wordQueue.length + ')');
                }
            }
            return originalFillText.call(this, text, x, y, ...rest);
        };
        const unhook = () => { CanvasRenderingContext2D.prototype.fillText = originalFillText; };

        const isGameDone = () => {
            const el = document.querySelector('#game');
            return !el || el.style.display === 'none'
                || !!window.approuter?.modelManager?._attempt;
        };

        status.textContent = 'Game: ' + gameName + ' - waiting for canvas...';
        let canvas = null;
        for (let i = 0; i < 80 && !canvas; i++) {
            canvas = document.querySelector('#game canvas');
            if (!canvas) await new Promise(r => setTimeout(r, 100));
        }
        if (!canvas) {
            unhook();
            status.textContent = 'Game canvas not found';
            console.error('#game canvas never appeared');
            stopBot();
            return;
        }
        await new Promise(r => setTimeout(r, 800));

        const spaceOpts = {
            key: ' ', code: 'Space', keyCode: 32, which: 32,
            bubbles: true, cancelable: true, view: window
        };
        document.dispatchEvent(new KeyboardEvent('keydown', spaceOpts));
        document.dispatchEvent(new KeyboardEvent('keyup', spaceOpts));
        console.log('Spacebar sent - waiting for first words to spawn...');
        await new Promise(r => setTimeout(r, 700));

        status.textContent = 'Game: ' + gameName + ' - detecting words...';
        const probeEnd = Date.now() + 3000;
        while (botRunning && !isGameDone() && wordQueue.length === 0 && Date.now() < probeEnd) {
            await new Promise(r => setTimeout(r, 150));
        }

        let directWordIndex = 0;
        let isDirectMode = false;
        if (wordQueue.length === 0) {
            if (lessonWords.length === 0) {
                unhook();
                status.textContent = 'No words - cannot read approuter.lesson';
                console.error('lessonWords empty and fillText yielded nothing');
                stopBot();
                return;
            }
            isDirectMode = true;
            console.log('fillText inactive - direct mode (' + lessonWords.length + ' words)');
            status.textContent = 'Direct mode: ' + lessonWords.length + ' words';
            wordQueue.push(lessonWords[directWordIndex++] || '');
            if (lessonWords[directWordIndex]) wordQueue.push(lessonWords[directWordIndex++]);
        }

        let staleTicks = 0;
        const TICK_MS = 100, MAX_STALE = 300;
        while (botRunning) {
            if (isGameDone()) break;
            if (wordQueue.length > 0) {
                staleTicks = 0;
                const word = wordQueue.shift();
                recentSeen.set(word.toLowerCase(), Date.now());
                status.textContent = 'Typing: "' + word + '"';
                console.log('Typing: "' + word + '"');
                await typeWordToGame(word);
                await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
                if (isDirectMode && directWordIndex < lessonWords.length) {
                    wordQueue.push(lessonWords[directWordIndex++]);
                } else if (isDirectMode && directWordIndex >= lessonWords.length) {
                    directWordIndex = 0;
                    console.log('Direct mode: restarting word list...');
                    wordQueue.push(lessonWords[directWordIndex++]);
                }
            } else {
                staleTicks++;
                if (staleTicks >= MAX_STALE) {
                    console.warn('Queue empty for ~30 s - assuming game complete');
                    break;
                }
                await new Promise(r => setTimeout(r, TICK_MS));
            }
        }

        unhook();
        console.log('Game complete: ' + gameName);
        levelsCompleted++;
        levelsCompletedEl.textContent = levelsCompleted;
        status.textContent = 'Game complete!';

        if (autoAdvance.checked) {
            await new Promise(r => setTimeout(r, 4000));
            const enterOpts = {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true, view: window
            };
            document.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
            document.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
            document.body.click();
            document.querySelectorAll('button, .btn, [role="button"], div[onclick], a')
                .forEach(el => {
                    if (el.offsetParent !== null && !el.closest('#typing-bot-gui')) el.click();
                });
            await new Promise(r => setTimeout(r, 1000));
            if (botRunning) processLevelUnified();
        } else {
            stopBot();
        }
    }

    async function typeWordToGame(word) {
        const wpm = parseInt(speedSlider.value);
        const baseDelay = 60000 / (wpm * 5);

        const tryInternalMethod = async () => {
            try {
                const game = window.game;
                if (game?.state) {
                    const state = game.state.states[game.state.current];
                    if (typeof state?.core?.record_keydown_time === 'function') {
                        for (const char of word) {
                            state.core.record_keydown_time(char);
                            await new Promise(r => setTimeout(r, baseDelay * (0.8 + Math.random() * 0.4)));
                        }
                        return true;
                    }
                }
            } catch (_) { }
            return false;
        };

        if (await tryInternalMethod()) {
            charsTypedCount += word.length;
            charsTypedEl.textContent = charsTypedCount;
            return true;
        }

        const focusInput = document.querySelector("body > input[type='text'][aria-hidden='true']");
        if (focusInput) {
            const nativeSetter = getNativeSetter();
            focusInput.focus();
            for (const char of word) {
                if (!botRunning) return false;
                typeCharImproved(char, focusInput, nativeSetter);
                charsTypedCount++;
                charsTypedEl.textContent = charsTypedCount;
                await new Promise(r => setTimeout(r, baseDelay * (0.8 + Math.random() * 0.4)));
            }
            return true;
        }

        console.warn('focusInput not found - falling back to document keypress');
        for (const char of word) {
            if (!botRunning) return false;
            const keyCode = char.charCodeAt(0);
            document.dispatchEvent(new KeyboardEvent('keypress', {
                key: char, keyCode, which: keyCode, charCode: keyCode,
                bubbles: true, cancelable: true, composed: true, view: window,
            }));
            charsTypedCount++;
            charsTypedEl.textContent = charsTypedCount;
            await new Promise(r => setTimeout(r, baseDelay * (0.8 + Math.random() * 0.4)));
        }
        return true;
    }

    async function processLevelUnified() {
        if (!botRunning) return;

        const level = detectLevelUnified();

        if (!level.text && level.type !== 'game' && level.type !== 'instruction') {
            status.textContent = 'No text or game found';
            console.log('Could not find text or game');
            stopBot();
            return;
        }

        if (level.type === 'instruction') {
            status.textContent = 'Skipping instruction...';
            console.log('Instruction screen - pressing Enter');
            await new Promise(r => setTimeout(r, 800));
            const enterOpts = {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true, view: window
            };
            const btn = document.querySelector('.navbar-continue');
            if (btn) btn.click();
            document.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
            document.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
            await new Promise(r => setTimeout(r, 1500));
            if (botRunning) processLevelUnified();
            return;
        }

        if (level.type === 'game') {
            await processTypingGameUnified(level.gameName || 'unknown');
            return;
        }

        const text = level.text;
        console.log('Text:', text);
        status.textContent = 'Starting lesson...';

        const typingArea = document.querySelector('.tpmodes, .typable, .inview');
        if (typingArea) typingArea.click();
        document.body.click();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', keyCode: 32, bubbles: true }));
        await new Promise(r => setTimeout(r, 500));

        let input = null;
        for (let attempt = 0; attempt < 30; attempt++) {
            input = document.querySelector("body > input[type='text'][aria-hidden='true']")
                || document.querySelector("input[type='text'][aria-hidden='true']");
            if (input) break;
            await new Promise(r => setTimeout(r, 100));
        }
        if (!input) {
            status.textContent = 'Input not found';
            console.log('No input field found');
            stopBot();
            return;
        }

        const nativeSetter = getNativeSetter();
        if (nativeSetter) nativeSetter.call(input, '');
        else input.value = '';
        input.focus();
        await new Promise(r => setTimeout(r, 100));

        const anchorKey = detectAnchorKey();
        let anchorInterval = null;

        if (anchorKey) {
            console.log('Anchor lesson - key: "' + anchorKey + '"');
            status.textContent = 'Holding "' + anchorKey.toUpperCase() + '" + typing...';

            const continueBtn = document.querySelector('.navbar-continue');
            if (continueBtn && continueBtn.offsetParent !== null) {
                continueBtn.click();
                await new Promise(r => setTimeout(r, 600));
                input.focus();
            }

            anchorInterval = startHoldingKey(anchorKey, input);
            await new Promise(r => setTimeout(r, 150));
        }

        const wpm = parseInt(speedSlider.value);
        const accuracy = parseInt(accuracySlider.value);
        const baseDelay = 60000 / (wpm * 5);
        status.textContent = anchorKey
            ? '"' + anchorKey.toUpperCase() + '" held - typing...'
            : 'Typing...';

        let burstMultiplier = 1.0;
        let burstCharsLeft = 0;

        for (let i = 0; i < text.length; i++) {
            if (!botRunning) {
                if (anchorKey && anchorInterval !== null) {
                    stopHoldingKey(anchorKey, input, anchorInterval);
                    anchorInterval = null;
                }
                return;
            }

            if (burstCharsLeft <= 0) {
                const roll = Math.random();
                if (roll < 0.35) { burstMultiplier = 0.5 + Math.random() * 0.3; }
                else if (roll < 0.65) { burstMultiplier = 0.9 + Math.random() * 0.2; }
                else { burstMultiplier = 1.2 + Math.random() * 0.7; }
                burstCharsLeft = 3 + Math.floor(Math.random() * 8);
            }
            burstCharsLeft--;

            const char = text[i];
            const shouldError = Math.random() * 100 > accuracy;
            const typo = (shouldError && /[a-zA-Z0-9,.\/;']/.test(char))
                ? getAdjacentTypo(char) : null;

            if (typo) {
                typeCharImproved(typo, input, nativeSetter);
                await new Promise(r => setTimeout(r, baseDelay * 0.5));
                typeBackspaceImproved(input);
                await new Promise(r => setTimeout(r, 300));
            }

            typeCharImproved(char, input, nativeSetter);
            charsTypedCount++;
            charsTypedEl.textContent = charsTypedCount;

            let delay = humanDelayImproved(char, i, text.length, baseDelay);
            delay *= burstMultiplier;
            await new Promise(r => setTimeout(r, delay));
        }

        if (anchorKey && anchorInterval !== null) {
            stopHoldingKey(anchorKey, input, anchorInterval);
            anchorInterval = null;
        }

        console.log('Complete!');
        levelsCompleted++;
        levelsCompletedEl.textContent = levelsCompleted;
        status.textContent = 'Complete! Waiting...';

        if (autoAdvance.checked) {
            await new Promise(r => setTimeout(r, 6000));
            const enterOpts = {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true, view: window
            };
            document.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
            document.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
            document.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
            if (input) {
                input.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
                input.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
                input.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
            }
            document.body.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
            document.body.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
            document.body.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
            document.body.click();
            const centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
            if (centerEl && !centerEl.closest('#typing-bot-gui')) centerEl.click();
            document.querySelectorAll('button, .btn, [role="button"], div[onclick], a')
                .forEach(el => {
                    if (el.offsetParent !== null && !el.closest('#typing-bot-gui')) el.click();
                });
            await new Promise(r => setTimeout(r, 1000));
            if (botRunning) processLevelUnified();
        } else {
            stopBot();
        }
    }

    function startBot() {
        botRunning = true;
        startBtn.disabled = true;
        startBtn.style.opacity = '0.4';
        stopBtn.disabled = false;
        stopBtn.style.opacity = '1';
        status.innerHTML = '<span class="pulse-dot"></span> Running …';
        console.log('Bot started');
        processLevelUnified();
    }

    function stopBot() {
        botRunning = false;
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        stopBtn.disabled = true;
        stopBtn.style.opacity = '0.3';
        status.textContent = '○ idle';
    }

    function closeBot() {
        stopBot();
        gui.remove();
        document.querySelector('style')?.remove();
        window.typingClubBot = null;
    }

    startBtn.addEventListener('click', startBot);
    stopBtn.addEventListener('click', stopBot);
    closeBtn.addEventListener('click', closeBot);

    window.typingClubBot = { start: startBot, stop: stopBot, close: closeBot };

    setTimeout(detectLevelUnified, 500);
    console.log('zMTest loaded! Click Start Bot.');
})();
