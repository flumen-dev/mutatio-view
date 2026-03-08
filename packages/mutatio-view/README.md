<p align="center">
  <img src="icon.svg" width="96" height="96" alt="mutatio-view" />
</p>

<h1 align="center">@flumen-dev/mutatio-view</h1>

<p align="center">
  A customizable Vue 3 diff viewer with split &amp; unified views, syntax highlighting, and full theming support.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flumen-dev/mutatio-view"><img src="https://img.shields.io/npm/v/@flumen-dev/mutatio-view?color=6366f1&label=npm" alt="npm version" /></a>
  <a href="https://github.com/flumen-dev/mutatio-view/blob/main/LICENSE"><img src="https://img.shields.io/github/license/flumen-dev/mutatio-view?color=818cf8" alt="license" /></a>
  <a href="https://www.buymeacoffee.com/flo0806"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>
</p>

---

## Install

```bash
pnpm add @flumen-dev/mutatio-view
# or
npm install @flumen-dev/mutatio-view
```

**Peer dependency:** Vue 3.4+

## Basic usage

```vue
<script setup>
import { ref } from 'vue'
import { DiffFileView } from '@flumen-dev/mutatio-view'
import '@flumen-dev/mutatio-view/style.css'

const mode = ref('split')

const hunks = [`@@ -1,3 +1,4 @@
-import { log } from './utils'
+import { log, warn } from './utils'
+import { format } from './format'

 export function greet(name: string) {`]
</script>

<template>
  <DiffFileView
    :hunks="hunks"
    :mode="mode"
    old-file-name="src/app.ts"
    new-file-name="src/app.ts"
    theme="light"
    highlight
    wrap
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hunks` | `string[]` | *required* | Raw diff hunks (unified diff format) |
| `mode` | `'split' \| 'unified'` | *required* | View mode |
| `oldFileName` | `string` | — | Original file name (used for syntax detection) |
| `newFileName` | `string` | — | New file name |
| `oldContent` | `string` | — | Full original file content (enables hunk expansion) |
| `newContent` | `string` | — | Full new file content (enables hunk expansion) |
| `highlight` | `boolean` | `false` | Enable syntax highlighting |
| `wrap` | `boolean` | `false` | Wrap long lines |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `selectedLines` | `number[]` | `[]` | Currently selected line numbers |
| `labelExpandUp` | `string` | — | Custom label for "expand up" button |
| `labelExpandDown` | `string` | — | Custom label for "expand down" button |
| `labelExpandAll` | `string` | — | Custom label for "expand all" button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `selectionChange` | `number[]` | Emitted when selected lines change (sorted) |

## Line selection

Click a line number to select/deselect it. Hold **Shift** and click to select a range. The component is fully controlled — you manage the state via `selectedLines` and `@selectionChange`:

```vue
<script setup>
const selected = ref([])
</script>

<template>
  <DiffFileView
    :hunks="hunks"
    mode="split"
    :selected-lines="selected"
    @selection-change="selected = $event"
  />
</template>
```

## Expandable hunks

Pass `oldContent` and `newContent` to enable expanding hidden context lines. Users can expand up, down, or reveal all hidden lines between hunks:

```vue
<DiffFileView
  :hunks="hunks"
  mode="unified"
  :old-content="fullOldFile"
  :new-content="fullNewFile"
  label-expand-all="Show all"
/>
```

## Theming & customization

mutatio-view ships with GitHub-inspired light and dark themes. Switch between them via the `theme` prop:

```vue
<DiffFileView :hunks="hunks" mode="split" theme="dark" />
```

### Custom colors via CSS

Every visual property is a CSS custom property. Override them on `.mutatio-view` or any parent:

```css
/* Your custom theme */
.mutatio-view {
  --diff-add-bg: #e6ffec;
  --diff-del-bg: #ffebe9;
  --diff-font-family: 'JetBrains Mono', monospace;
  --diff-font-size: 13px;
}
```

### Custom dark mode

```css
.mutatio-view.mutatio-dark {
  --diff-add-bg: #1a2e1a;
  --diff-del-bg: #2e1a1a;
  --diff-add-num-bg: #243d24;
  --diff-del-num-bg: #3d2424;
  --diff-selected-bg: #1a3a5c;
  --diff-border-color: #333;
}
```

### All CSS custom properties

| Variable | Light default | Dark default | Description |
|----------|--------------|--------------|-------------|
| `--diff-text-color` | `#1f2328` | `#e6edf3` | Main text color |
| `--diff-add-bg` | `#dafbe1` | `#18271f` | Added line background |
| `--diff-del-bg` | `#ffebe9` | `#23191c` | Deleted line background |
| `--diff-add-num-bg` | `#aceebb` | `#284228` | Added line number gutter |
| `--diff-del-num-bg` | `#ffcecb` | `#4f2828` | Deleted line number gutter |
| `--diff-hunk-bg` | `#ddf4ff` | `#131d2e` | Hunk header background |
| `--diff-selected-bg` | `#b6d0f7` | `#1a3a5c` | Selected line background |
| `--diff-add-marker-color` | `#1a7f37` | `#3fb950` | `+` marker color |
| `--diff-del-marker-color` | `#cf222e` | `#f85149` | `-` marker color |
| `--diff-border-color` | `#d1d9e0` | `#30363d` | Gutter border |
| `--diff-line-num-color` | `rgba(0,0,0,0.4)` | `rgba(255,255,255,0.4)` | Line number color |
| `--diff-link-color` | `#0969da` | `#58a6ff` | Expand button color |
| `--diff-hunk-color` | `inherit` | `inherit` | Hunk header text |
| `--diff-font-family` | system monospace stack | — | Code font |
| `--diff-font-size` | `12px` | — | Code font size |

## Exports

```ts
// Components
import { DiffFileView, DiffSplitView, DiffUnifiedView } from '@flumen-dev/mutatio-view'

// Utilities
import { markerPrefix, contentBg, numBg, buildContentHtml } from '@flumen-dev/mutatio-view'

// Styles
import '@flumen-dev/mutatio-view/style.css'
```

## Roadmap

- **Inline word & character-level diffs** — highlight the exact characters that changed within a line, not just the whole line
- **Virtual scrolling** — render only visible lines for smooth performance on large diffs (1000+ lines)
- **Minimap** — a vertical scroll overview showing add/delete blocks at a glance with click-to-jump navigation

## Support

mutatio-view is **free and open source**. If you find it useful, consider supporting development:

<a href="https://github.com/sponsors/Flo0806"><img src="https://img.shields.io/badge/Sponsor-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor on GitHub"></a>
<a href="https://www.buymeacoffee.com/flo0806" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="28"></a>

## Acknowledgments

Built with ❤️ on top of [@git-diff-view/core](https://github.com/nicodemus26/git-diff-view) — an amazing project that handles the heavy lifting of diff parsing and syntax highlighting. Thank you!

## License

[MIT](../../LICENSE)
