# Typing Club zMBot v5.0

## Overview

Automated typing utility for TypingClub.com with graphical interface, multi-game support, and realistic typing simulation.

---

## Features

- **Multi-game support**: Balloons, Token, generic typing games
- **Realistic typing**: Configurable speed (30-190 WPM) and accuracy (92-100%)
- **Auto-advance**: Automatic lesson progression
- **GUI**: Draggable window with live statistics
- **Anchor key support**: Handles left/right anchor lessons

---

## Quick Start

1. Go to TypingClub.com
2. Open browser console (F12)
3. If paste is blocked, type `allow pasting` and press Enter
4. Paste the script and press Enter
5. Click "Start Bot" to begin

---

## Controls

| Control | Function |
|---------|----------|
| Speed slider | Adjust typing speed (30-190 WPM) |
| Accuracy slider | Adjust error rate (92-100%) |
| Auto-advance | Toggle automatic lesson progression |
| Start Bot | Begin automation |
| Stop Bot | Halt automation |
| Double-click header | Pin/unpin GUI |
| × button | Close bot |

---

## Supported Games

- Balloons (Phaser engine)
- Token
- Generic typing lessons
- Instruction screens (auto-skipped)
- Anchor key lessons

---

## Programmatic Control

```javascript
window.typingClubBot.start();  // Start bot
window.typingClubBot.stop();   // Stop bot
window.typingClubBot.close();  // Close bot
```

---

## Requirements

- Chrome/Chromium browser
- Active TypingClub lesson page
- JavaScript enabled

---

## Limitations

- Designed exclusively for TypingClub.com
- Browser-dependent
- Relies on specific DOM structure

---

## License

MIT License
