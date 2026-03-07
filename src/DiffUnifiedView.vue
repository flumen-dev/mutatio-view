<script lang="ts" setup>
import { type DiffFile, DiffLineType, type UnifiedLineItem } from '@git-diff-view/core';
import { buildContentHtml, contentBg, numBg } from './utils';

const props = withDefaults(
  defineProps<{
    diffFile: DiffFile;
    renderTick: number;
    wrap: boolean;
    expandable: boolean;
    selectedStart?: number;
    selectedEnd?: number;
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

function getLine(i: number): UnifiedLineItem {
  return props.diffFile.getUnifiedLine(i);
}

function isHunk(i: number): boolean {
  const hunk = props.diffFile.getUnifiedHunkLine(i);
  if (!hunk) {
    return false;
  }
  const info = hunk.unifiedInfo;
  if (info && info.startHiddenIndex >= info.endHiddenIndex) {
    return false;
  }
  return true;
}

function lineKey(line: UnifiedLineItem): number | undefined {
  return line.newLineNumber ?? line.oldLineNumber;
}

function isSelected(line: UnifiedLineItem) {
  const num = lineKey(line);
  if (!num || !props.selectedStart || !props.selectedEnd) {
    return false;
  }
  return num >= props.selectedStart && num <= props.selectedEnd;
}

function getContentHtml(line: UnifiedLineItem): string {
  const lineNumber = line.newLineNumber ?? line.oldLineNumber;
  const side = line.diff?.type === DiffLineType.Delete ? 'old' : 'new';
  return buildContentHtml(props.diffFile, lineNumber, line.value, line.diff?.type, side);
}

function onNumClick(e: MouseEvent, line: UnifiedLineItem) {
  const num = lineKey(line);
  if (!num) {
    return;
  }
  e.preventDefault();
  emit('lineClick', num, e.shiftKey);
}
</script>

<template>
  <div class="mutatio-diff-table" :data-tick="renderTick">
    <table>
      <tbody>
        <template v-for="i in diffFile.unifiedLineLength" :key="`${renderTick}-${i}`">
          <!-- Hunk row -->
          <tr v-if="isHunk(i - 1)" :class="expandable ? 'hunk-row' : 'hunk-collapsed'">
            <td colspan="3" class="hunk-cell">
              <div class="hunk-content">
                <span class="hunk-text">{{
                  diffFile.getUnifiedHunkLine(i - 1)?.unifiedInfo?.plainText ?? ''
                }}</span>
                <template v-if="expandable">
                  <button
                    v-if="!diffFile.getUnifiedHunkLine(i - 1)?.isFirst"
                    class="expand-btn"
                    @click="diffFile.onUnifiedHunkExpand('up', i - 1)"
                  >
                    {{ labelExpandUp }}
                  </button>
                  <button
                    v-if="!diffFile.getUnifiedHunkLine(i - 1)?.isLast"
                    class="expand-btn"
                    @click="diffFile.onUnifiedHunkExpand('down', i - 1)"
                  >
                    {{ labelExpandDown }}
                  </button>
                  <button class="expand-btn" @click="diffFile.onUnifiedHunkExpand('all', i - 1)">
                    {{ labelExpandAll }}
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <!-- Content row -->
          <tr
            v-else-if="!getLine(i - 1).isHidden"
            :class="{ 'row-selected': isSelected(getLine(i - 1)) }"
          >
            <td
              class="line-num"
              :style="{ backgroundColor: numBg(getLine(i - 1).diff?.type) }"
              @click="onNumClick($event, getLine(i - 1))"
            >
              {{ getLine(i - 1).oldLineNumber ?? '' }}
            </td>

            <td
              class="line-num"
              :style="{ backgroundColor: numBg(getLine(i - 1).diff?.type) }"
              @click="onNumClick($event, getLine(i - 1))"
            >
              {{ getLine(i - 1).newLineNumber ?? '' }}
            </td>

            <td
              class="diff-content"
              :class="wrap ? 'wrap-mode' : 'nowrap-mode'"
              :style="{ backgroundColor: contentBg(getLine(i - 1).diff?.type) }"
              v-html="getContentHtml(getLine(i - 1))"
            />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
