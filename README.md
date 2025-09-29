# 42-time-extension

[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/42-time/mkcopllnpeelmaigfccokdclgaefnjoe?authuser=3&hl=ko)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/42-time/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

After installation, check your profile calendar! 42-time is a cross-browser extension that visually displays your accumulated monthly login time on the 42 intra.
<br>
<img width="173" alt="intra-original" src="https://github.com/user-attachments/assets/1aceb15b-7392-42cc-b9e3-1bfe4cf68836" />
<br>
<img width="200" alt="intra-v3" src="https://github.com/user-attachments/assets/83d6abf9-d905-4aa3-963f-0498ec8ceb5d" />

## Main Features

- **Cross-browser support**: Works on both Chrome and Firefox
- ️ **Time tracking**: Displays accumulated monthly login time (in hours/minutes) on the 42 intra page
- **Profile v3 support**: Compatible with both old and new 42 intra profiles
- **Multi-language**: Supports 6 languages (EN, KO, JA, AR, FR, IT)

## Installation

### Chrome

1. Clone this repository or download it as a zip file.
2. Run `npm run build`
3. Go to `chrome://extensions` in your Chrome browser.
4. Enable **Developer mode** in the top right corner.
5. Click **Load unpacked** and select the `dist` folder.

### Firefox

1. Clone this repository or download it as a zip file.
2. Build the Firefox version: `npm run build:firefox`
3. Go to `about:debugging` in your Firefox browser.
4. Click **This Firefox** in the left sidebar.
5. Click **Load Temporary Add-on** and select `dist/manifest.json`.

## Usage

1. Log in to 42 intra (https://intra.42.fr).
2. The accumulated monthly login time will be automatically displayed within the intra.

## Development Environment

- TypeScript
- Webpack
- Cross-browser compatibility layer

## Development & Build

```bash
npm install

# For Chrome
npm run build

# For Firefox
npm run build:firefox

# Development mode
npm run dev        # Chrome
npm run dev:firefox # Firefox
```

- The build output will be generated in the `dist/` folder.

## Contribution

1. Feel free to leave feedback or suggestions via issues or PRs .

## License

MIT

---

Questions and feedback are always welcome!
