<div align="center">

# Typing-Club-Automation 2026

Automated typing utility built in JavaScript

<br>

![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-yellow)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

Automated typing utility built in JavaScript for browser execution.

Typing-Club-Automation reads available lesson content and simulates realistic keyboard input with configurable delays and optional human-like typing behavior.

## Features

* Automatic text detection across multiple lesson formats
* Human-like typing speed simulation
* Configurable typing delay range
* Optional typo generation and correction
* Dynamic handling for different lesson layouts
* Automatic key event dispatching
* Lightweight single-file implementation

---

## Configuration

Adjust the `CONFIG` object to customize behavior:

```js
const CONFIG = {
  minDelay: 80,
  maxDelay: 215,
  enableMistakes: true,
  mistakeChance: 0.03,
};
```

### Parameters

| Setting          | Description                           |
| ---------------- | ------------------------------------- |
| `minDelay`       | Minimum delay between keystrokes (ms) |
| `maxDelay`       | Maximum delay between keystrokes (ms) |
| `enableMistakes` | Enables typo simulation               |
| `mistakeChance`  | Probability of generating a typo      |

### Recommended Values

| Profile  | Delay        |
| -------- | ------------ |
| Fast     | `80–200 ms`  |
| Balanced | `110–215 ms` |
| Slow     | `160–280 ms` |

---

## How It Works

The script:

1. Detects the active typing environment
2. Extracts visible lesson characters
3. Generates keyboard events
4. Applies configurable timing variation
5. Optionally introduces and corrects typing mistakes
6. Completes the detected lesson text

---

## Usage

1. Open the supported typing page.
2. Open browser developer tools.
3. Navigate to **Console**.
4. If the browser shows a warning preventing paste actions, type:

```text
allow pasting
```

and press **Enter**.
5. Paste the script.
6. Execute.

---

## Notes

* Intended for educational and experimentation purposes.
* Timing behavior may vary depending on browser and page updates.
* Compatibility depends on the structure of the target page.

---

## License

This project is licensed under the **MIT License**.
