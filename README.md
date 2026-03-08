<p align="center">
  <img src="packages/mutatio-view/icon.svg" width="96" height="96" alt="mutatio-view" />
</p>

<h1 align="center">mutatio-view</h1>

<p align="center">
  A customizable Vue 3 diff viewer component with split &amp; unified views, syntax highlighting, line selection, and full theming support.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flumen-dev/mutatio-view"><img src="https://img.shields.io/npm/v/@flumen-dev/mutatio-view?color=6366f1&label=npm" alt="npm version" /></a>
  <a href="https://github.com/flumen-dev/mutatio-view/blob/main/LICENSE"><img src="https://img.shields.io/github/license/flumen-dev/mutatio-view?color=818cf8" alt="license" /></a>
  <a href="https://www.buymeacoffee.com/flo0806"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>
</p>

---

## Why mutatio-view?

Existing diff viewers are either too opinionated or too low-level. **mutatio-view** sits in between: it gives you a production-ready diff component that you can drop into your app *and* customize entirely via CSS custom properties — colors, fonts, dark mode, everything.

- **Split & Unified view** — toggle between side-by-side and single-column diffs
- **Syntax highlighting** — powered by highlight.js through `@git-diff-view/core`
- **Line selection** — click to select, shift-click for ranges, fully controlled via props
- **Expandable hunks** — reveal hidden context lines on demand
- **Dark & Light themes** — built-in GitHub-inspired themes, fully overridable
- **CSS-first customization** — every color, font, and spacing is a CSS custom property
- **Zero runtime CSS-in-JS** — plain CSS, no dependencies beyond Vue and the diff engine

## Quick start

```bash
pnpm add @flumen-dev/mutatio-view
```

```vue
<script setup>
import { ref } from 'vue'
import { DiffFileView } from '@flumen-dev/mutatio-view'
import '@flumen-dev/mutatio-view/style.css'

const mode = ref('split')
const diff = `@@ -1,3 +1,3 @@
-const greeting = 'hello'
+const greeting = 'hello, world'
 export default greeting`
</script>

<template>
  <DiffFileView
    :hunks="[diff]"
    :mode="mode"
    theme="light"
  />
</template>
```

## Monorepo structure

```
packages/
  mutatio-view/   # The library — published as @flumen-dev/mutatio-view
  playground/     # Interactive demo app for development
```

## Development

```bash
pnpm install
pnpm dev:playground   # Start playground dev server
pnpm build            # Build the library
pnpm lint             # Lint with oxlint + oxfmt
pnpm typecheck        # Type-check with vue-tsc
```

## Roadmap

- **Inline word & character-level diffs** — highlight the exact characters that changed within a line, not just the whole line
- **Virtual scrolling** — render only visible lines for smooth performance on large diffs (1000+ lines)
- **Minimap** — a vertical scroll overview showing add/delete blocks at a glance with click-to-jump navigation

## Support

mutatio-view is **free and open source**. If you find it useful, consider supporting development:

<a href="https://github.com/sponsors/Flo0806"><img src="https://img.shields.io/badge/Sponsor-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor on GitHub"></a>
<a href="https://www.buymeacoffee.com/flo0806" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="28"></a>

### Sponsors

<!-- sponsors -->
<!-- sponsors -->

## Acknowledgments

Built with ❤️ on top of [@git-diff-view/core](https://github.com/nicodemus26/git-diff-view) — an amazing project that handles the heavy lifting of diff parsing and syntax highlighting. Thank you!

## License

[MIT](LICENSE)
