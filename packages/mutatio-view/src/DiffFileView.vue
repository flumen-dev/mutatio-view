<script lang="ts" setup>
import { DiffFile } from '@git-diff-view/core';
import DiffSplitView from './DiffSplitView.vue';
import DiffUnifiedView from './DiffUnifiedView.vue';
import { computed, onUnmounted, ref, shallowRef, triggerRef, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    hunks: string[];
    oldFileName?: string;
    newFileName?: string;
    oldContent?: string;
    newContent?: string;
    mode: 'split' | 'unified';
    highlight?: boolean;
    wrap?: boolean;
    theme?: 'light' | 'dark';
    selectedLines?: number[];
    labelExpandUp?: string;
    labelExpandDown?: string;
    labelExpandAll?: string;
  }>(),
  {
    selectedLines: () => [],
  },
);

const emit = defineEmits<{
  selectionChange: [lines: number[]];
}>();

const diffFile = shallowRef<DiffFile>();
const renderTick = ref(0);

const selectedSet = computed(() => new Set(props.selectedLines));

let lastClicked: number | undefined;

function onLineClick(lineNumber: number, shiftKey: boolean) {
  const current = new Set(props.selectedLines);

  if (shiftKey && lastClicked !== undefined) {
    const from = Math.min(lastClicked, lineNumber);
    const to = Math.max(lastClicked, lineNumber);
    for (let n = from; n <= to; n++) {
      current.add(n);
    }
  } else if (current.has(lineNumber)) {
    current.delete(lineNumber);
  } else {
    current.add(lineNumber);
  }

  lastClicked = lineNumber;
  emit('selectionChange', [...current].sort((a, b) => a - b));
}

function getLang(fileName?: string) {
  return fileName?.split('.').pop() || '';
}

let unsubscribe: (() => void) | undefined;

watch(
  () =>
    [
      props.hunks,
      props.oldFileName,
      props.newFileName,
      props.oldContent,
      props.newContent,
    ] as const,
  () => {
    unsubscribe?.();
    diffFile.value?.clear();

    const file = DiffFile.createInstance({
      hunks: props.hunks,
      newFile: {
        fileName: props.newFileName,
        fileLang: getLang(props.newFileName),
        content: props.newContent,
      },
      oldFile: {
        fileName: props.oldFileName,
        fileLang: getLang(props.oldFileName),
        content: props.oldContent,
      },
    });

    file.initTheme(props.theme === 'dark' ? 'dark' : 'light');
    file.init();

    file.buildSplitDiffLines();
    file.buildUnifiedDiffLines();

    unsubscribe = file.subscribe(() => {
      triggerRef(diffFile);
      renderTick.value++;
    });

    diffFile.value = file;
    renderTick.value++;
  },
  { immediate: true },
);

onUnmounted(() => {
  unsubscribe?.();
  diffFile.value?.clear();
});

watch(
  () => props.theme,
  () => {
    if (diffFile.value) {
      diffFile.value.initTheme(props.theme === 'dark' ? 'dark' : 'light');
      renderTick.value++;
    }
  },
);
</script>

<template>
  <div class="mutatio-view" :class="{ 'mutatio-dark': theme === 'dark' }">
    <DiffSplitView
      v-if="diffFile && mode === 'split'"
      :diff-file="diffFile"
      :render-tick="renderTick"
      :wrap="wrap ?? false"
      :expandable="!!props.oldContent || !!props.newContent"
      :selected-lines="selectedSet"
      :label-expand-up="labelExpandUp"
      :label-expand-down="labelExpandDown"
      :label-expand-all="labelExpandAll"
      @line-click="onLineClick"
    />
    <DiffUnifiedView
      v-else-if="diffFile && mode === 'unified'"
      :diff-file="diffFile"
      :render-tick="renderTick"
      :wrap="wrap ?? false"
      :expandable="!!props.oldContent || !!props.newContent"
      :selected-lines="selectedSet"
      :label-expand-up="labelExpandUp"
      :label-expand-down="labelExpandDown"
      :label-expand-all="labelExpandAll"
      @line-click="onLineClick"
    />
  </div>
</template>
