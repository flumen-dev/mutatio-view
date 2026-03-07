<script lang="ts" setup>
import { type DiffFile, type SplitLineItem } from '@git-diff-view/core';
import { buildContentHtml, contentBg, numBg } from './utils';

const props = withDefaults(
  defineProps<{
    diffFile: DiffFile;
    renderTick: number;
    wrap: boolean;
    expandable: boolean;
    selectedLines: Set<number>;
    labelExpandUp?: string;
    labelExpandDown?: string;
    labelExpandAll?: string;
  }>(),
  {
    labelExpandAll: 'Expand all',
    labelExpandDown: 'Expand down',
    labelExpandUp: 'Expand up',
  },
);

const emit = defineEmits<{
  lineClick: [lineNumber: number, shiftKey: boolean];
}>();

function isSelected(lineNum: number | undefined) {
  if (!lineNum) {
    return false;
  }
  return props.selectedLines.has(lineNum);
}

function getContentHtml(line: SplitLineItem, side: 'old' | 'new'): string {
  return buildContentHtml(props.diffFile, line.lineNumber, line.value, line.diff?.type, side);
}

function left(i: number): SplitLineItem {
  return props.diffFile.getSplitLeftLine(i);
}

function right(i: number): SplitLineItem {
  return props.diffFile.getSplitRightLine(i);
}

function isHunk(i: number): boolean {
  const hunk = props.diffFile.getSplitHunkLine(i);
  if (!hunk) {
    return false;
  }
  const info = hunk.splitInfo;
  if (info && info.startHiddenIndex >= info.endHiddenIndex) {
    return false;
  }
  return true;
}

function onNumClick(e: MouseEvent, lineNum: number) {
  e.preventDefault();
  emit('lineClick', lineNum, e.shiftKey);
}
</script>

<template>
  <div class="mutatio-diff-table" :data-tick="renderTick">
    <table>
      <tbody>
        <template v-for="i in diffFile.splitLineLength" :key="`${renderTick}-${i}`">
          <!-- Hunk row -->
          <tr v-if="isHunk(i - 1)" :class="expandable ? 'hunk-row' : 'hunk-collapsed'">
            <td colspan="4" class="hunk-cell">
              <div class="hunk-content">
                <span class="hunk-text">{{
                  diffFile.getSplitHunkLine(i - 1)?.splitInfo?.plainText ?? ''
                }}</span>
                <template v-if="expandable">
                  <button
                    v-if="!diffFile.getSplitHunkLine(i - 1)?.isFirst"
                    class="expand-btn"
                    @click="diffFile.onSplitHunkExpand('up', i - 1)"
                  >
                    {{ labelExpandUp }}
                  </button>
                  <button
                    v-if="!diffFile.getSplitHunkLine(i - 1)?.isLast"
                    class="expand-btn"
                    @click="diffFile.onSplitHunkExpand('down', i - 1)"
                  >
                    {{ labelExpandDown }}
                  </button>
                  <button class="expand-btn" @click="diffFile.onSplitHunkExpand('all', i - 1)">
                    {{ labelExpandAll }}
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <!-- Content row -->
          <tr
            v-else-if="!left(i - 1).isHidden || !right(i - 1).isHidden"
            :class="{
              'row-selected': isSelected(right(i - 1).lineNumber) || isSelected(left(i - 1).lineNumber),
            }"
          >
            <td
              class="line-num"
              :style="{ backgroundColor: isSelected(left(i - 1).lineNumber) ? 'var(--diff-selected-bg)' : numBg(left(i - 1).diff?.type) }"
              @click="left(i - 1).lineNumber && onNumClick($event, left(i - 1).lineNumber!)"
            >
              {{ left(i - 1).lineNumber ?? '' }}
            </td>

            <td
              class="diff-content split-content side-left"
              :class="wrap ? 'wrap-mode' : 'nowrap-mode'"
              :style="{ backgroundColor: isSelected(left(i - 1).lineNumber) ? 'var(--diff-selected-bg)' : contentBg(left(i - 1).diff?.type) }"
              v-html="getContentHtml(left(i - 1), 'old')"
            />

            <td
              class="line-num"
              :style="{ backgroundColor: isSelected(right(i - 1).lineNumber) ? 'var(--diff-selected-bg)' : numBg(right(i - 1).diff?.type) }"
              @click="right(i - 1).lineNumber && onNumClick($event, right(i - 1).lineNumber!)"
            >
              {{ right(i - 1).lineNumber ?? '' }}
            </td>

            <td
              class="diff-content split-content"
              :class="wrap ? 'wrap-mode' : 'nowrap-mode'"
              :style="{ backgroundColor: isSelected(right(i - 1).lineNumber) ? 'var(--diff-selected-bg)' : contentBg(right(i - 1).diff?.type) }"
              v-html="getContentHtml(right(i - 1), 'new')"
            />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.split-content {
  width: 50%;
}

.side-left {
  border-right: 1px solid var(--diff-border-color);
}
</style>
