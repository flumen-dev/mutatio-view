<script lang="ts" setup>
import { DiffFile } from '@git-diff-view/core'
import DiffSplitView from './DiffSplitView.vue'
import DiffUnifiedView from './DiffUnifiedView.vue'
import { shallowRef, ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  hunks: string[]
  oldFileName?: string
  newFileName?: string
  oldContent?: string
  newContent?: string
  mode: 'split' | 'unified'
  highlight?: boolean
  wrap?: boolean
  theme?: 'light' | 'dark'
  selectedStart?: number
  selectedEnd?: number
  labelExpandUp?: string
  labelExpandDown?: string
  labelExpandAll?: string
}>()

const emit = defineEmits<{
  lineClick: [lineNumber: number, shiftKey: boolean]
}>()

const diffFile = shallowRef<DiffFile>()
const renderTick = ref(0)

function getLang(fileName?: string) {
  return fileName?.split('.').pop() || ''
}

let unsubscribe: (() => void) | undefined

watch(
  () => [props.hunks, props.oldFileName, props.newFileName, props.oldContent, props.newContent] as const,
  () => {
    unsubscribe?.()
    diffFile.value?.clear()

    const file = DiffFile.createInstance({
      oldFile: { fileName: props.oldFileName, fileLang: getLang(props.oldFileName), content: props.oldContent },
      newFile: { fileName: props.newFileName, fileLang: getLang(props.newFileName), content: props.newContent },
      hunks: props.hunks,
    })

    file.initTheme(props.theme === 'dark' ? 'dark' : 'light')
    file.init()

    file.buildSplitDiffLines()
    file.buildUnifiedDiffLines()

    unsubscribe = file.subscribe(() => {
      renderTick.value++
    })

    diffFile.value = file
    renderTick.value++
  },
  { immediate: true },
)

onUnmounted(() => {
  unsubscribe?.()
  diffFile.value?.clear()
})

watch(() => props.theme, () => {
  if (diffFile.value) {
    diffFile.value.initTheme(props.theme === 'dark' ? 'dark' : 'light')
    renderTick.value++
  }
})
</script>

<template>
  <div class="mutatio-view" :class="{ 'mutatio-dark': theme === 'dark' }">
    <DiffSplitView
      v-if="diffFile && mode === 'split'"
      :diff-file="diffFile"
      :render-tick="renderTick"
      :wrap="wrap ?? false"
      :expandable="!!props.oldContent || !!props.newContent"
      :selected-start="selectedStart"
      :selected-end="selectedEnd"
      :label-expand-up="labelExpandUp"
      :label-expand-down="labelExpandDown"
      :label-expand-all="labelExpandAll"
      @line-click="(n, shift) => emit('lineClick', n, shift)"
    />
    <DiffUnifiedView
      v-else-if="diffFile && mode === 'unified'"
      :diff-file="diffFile"
      :render-tick="renderTick"
      :wrap="wrap ?? false"
      :expandable="!!props.oldContent || !!props.newContent"
      :selected-start="selectedStart"
      :selected-end="selectedEnd"
      :label-expand-up="labelExpandUp"
      :label-expand-down="labelExpandDown"
      :label-expand-all="labelExpandAll"
      @line-click="(n, shift) => emit('lineClick', n, shift)"
    />
  </div>
</template>
