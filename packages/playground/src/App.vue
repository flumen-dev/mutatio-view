<script lang="ts" setup>
import { ref } from 'vue';
import { DiffFileView } from '@flumen-dev/mutatio-view';
import '@flumen-dev/mutatio-view/style.css';

const mode = ref<'split' | 'unified'>('split');
const wrap = ref(true);
const theme = ref<'light' | 'dark'>('light');
const selectedLines = ref<number[]>([]);

const sampleDiff = `diff --git a/src/hello.ts b/src/hello.ts
index 1234567..abcdefg 100644
--- a/src/hello.ts
+++ b/src/hello.ts
@@ -1,10 +1,12 @@
-import { log } from './utils'
+import { log, warn } from './utils'
+import { format } from './format'

 export function greet(name: string) {
-  log('Hello ' + name)
+  const message = \`Hello, \${name}!\`
+  log(message)
   return true
 }

-export function farewell() {
-  log('Goodbye')
+export function farewell(name: string) {
+  warn(\`Goodbye, \${name}\`)
 }
`;

const oldContent = `import { log } from './utils'

export function greet(name: string) {
  log('Hello ' + name)
  return true
}

export function farewell() {
  log('Goodbye')
}
`;

const newContent = `import { log, warn } from './utils'
import { format } from './format'

export function greet(name: string) {
  const message = \`Hello, \${name}!\`
  log(message)
  return true
}

export function farewell(name: string) {
  warn(\`Goodbye, \${name}\`)
}
`;

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
}
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto">
    <h1 style="margin-bottom: 16px">Mutatio View Playground</h1>

    <div style="display: flex; gap: 8px; margin-bottom: 16px">
      <button @click="mode = 'split'" :style="{ fontWeight: mode === 'split' ? 'bold' : 'normal' }">
        Split
      </button>
      <button
        @click="mode = 'unified'"
        :style="{ fontWeight: mode === 'unified' ? 'bold' : 'normal' }"
      >
        Unified
      </button>
      <button @click="wrap = !wrap">Wrap: {{ wrap ? 'On' : 'Off' }}</button>
      <button @click="toggleTheme">Theme: {{ theme }}</button>
      <span v-if="selectedLines.length" style="margin-left: auto; font-size: 14px; opacity: 0.7">
        Selected: {{ selectedLines.join(', ') }}
      </span>
    </div>

    <div style="border: 1px solid #d1d9e0; border-radius: 8px; overflow: hidden">
      <DiffFileView
        :hunks="[sampleDiff]"
        old-file-name="src/hello.ts"
        new-file-name="src/hello.ts"
        :old-content="oldContent"
        :new-content="newContent"
        :mode="mode"
        :wrap="wrap"
        :theme="theme"
        :selected-lines="selectedLines"
        @selection-change="selectedLines = $event"
      />
    </div>
  </div>
</template>
