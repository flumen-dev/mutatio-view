<script lang="ts" setup>
import { type DiffFile, type UnifiedLineItem, DiffLineType, getSyntaxLineTemplate, escapeHtml } from '@git-diff-view/core'

const props = defineProps<{
  diffFile: DiffFile
  renderTick: number
  wrap: boolean
  expandable: boolean
  selectedStart?: number
  selectedEnd?: number
  labelExpandUp?: string
  labelExpandDown?: string
  labelExpandAll?: string
}>()

const emit = defineEmits<{
  lineClick: [lineNumber: number, shiftKey: boolean]
}>()

function getLine(i: number): UnifiedLineItem {
  return props.diffFile.getUnifiedLine(i)
}

function isHunk(i: number): boolean {
  return !!props.diffFile.getUnifiedHunkLine(i)
}

function lineKey(line: UnifiedLineItem): number | undefined {
  return line.newLineNumber ?? line.oldLineNumber
}

function isSelected(line: UnifiedLineItem) {
  const num = lineKey(line)
  if (!num || !props.selectedStart || !props.selectedEnd) return false
  return num >= props.selectedStart && num <= props.selectedEnd
}

function getContentHtml(line: UnifiedLineItem): string {
  const lineNumber = line.newLineNumber ?? line.oldLineNumber
  if (!lineNumber) return escapeHtml(line.value ?? '')

  const isAdd = line.diff?.type === DiffLineType.Add
  const isDel = line.diff?.type === DiffLineType.Delete
  const marker = isAdd ? '+' : isDel ? '-' : ' '
  const color = isAdd ? 'color: #16a34a' : isDel ? 'color: #dc2626' : ''
  const prefix = `<span class="diff-marker" style="${color}">${marker}</span>`

  const side = isDel ? 'old' : 'new'
  const syntaxLine = side === 'old'
    ? props.diffFile.getOldSyntaxLine(lineNumber)
    : props.diffFile.getNewSyntaxLine(lineNumber)
  if (syntaxLine) {
    const template = getSyntaxLineTemplate(syntaxLine)
    if (template) return prefix + template
  }

  return prefix + escapeHtml(line.value ?? '')
}

function contentBg(line: UnifiedLineItem): string {
  if (line.diff?.type === DiffLineType.Add) return 'var(--diff-add-bg)'
  if (line.diff?.type === DiffLineType.Delete) return 'var(--diff-del-bg)'
  return ''
}

function numBg(line: UnifiedLineItem): string {
  if (line.diff?.type === DiffLineType.Add) return 'var(--diff-add-num-bg)'
  if (line.diff?.type === DiffLineType.Delete) return 'var(--diff-del-num-bg)'
  return ''
}

function onNumClick(e: MouseEvent, line: UnifiedLineItem) {
  const num = lineKey(line)
  if (!num) return
  e.preventDefault()
  emit('lineClick', num, e.shiftKey)
}
</script>

<template>
  <div
    class="mutatio-unified-view"
    :data-tick="renderTick"
  >
    <table>
      <tbody>
        <template
          v-for="i in diffFile.unifiedLineLength"
          :key="i - 1"
        >
          <!-- Hunk row -->
          <tr
            v-if="isHunk(i - 1)"
            :class="expandable ? 'hunk-row' : 'hunk-collapsed'"
          >
            <td
              colspan="3"
              class="hunk-cell"
            >
              <div class="hunk-content">
                <span class="hunk-text">{{ diffFile.getUnifiedHunkLine(i - 1)?.unifiedInfo?.plainText ?? '' }}</span>
                <template v-if="expandable">
                  <button
                    v-if="!diffFile.getUnifiedHunkLine(i - 1)?.isFirst"
                    class="expand-btn"
                    @click="diffFile.onUnifiedHunkExpand('up', i - 1)"
                  >
                    {{ labelExpandUp ?? '↑ Expand' }}
                  </button>
                  <button
                    v-if="!diffFile.getUnifiedHunkLine(i - 1)?.isLast"
                    class="expand-btn"
                    @click="diffFile.onUnifiedHunkExpand('down', i - 1)"
                  >
                    {{ labelExpandDown ?? '↓ Expand' }}
                  </button>
                  <button
                    class="expand-btn"
                    @click="diffFile.onUnifiedHunkExpand('all', i - 1)"
                  >
                    {{ labelExpandAll ?? '↕ All' }}
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
            <!-- Old line number -->
            <td
              class="line-num"
              :style="{ backgroundColor: numBg(getLine(i - 1)) }"
              @click="onNumClick($event, getLine(i - 1))"
            >
              {{ getLine(i - 1).oldLineNumber ?? '' }}
            </td>

            <!-- New line number -->
            <td
              class="line-num"
              :style="{ backgroundColor: numBg(getLine(i - 1)) }"
              @click="onNumClick($event, getLine(i - 1))"
            >
              {{ getLine(i - 1).newLineNumber ?? '' }}
            </td>

            <!-- Content -->
            <td
              class="diff-content"
              :class="wrap ? 'wrap-mode' : 'nowrap-mode'"
              :style="{ backgroundColor: contentBg(getLine(i - 1)) }"
              v-html="getContentHtml(getLine(i - 1))"
            />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.mutatio-unified-view {
  overflow-x: auto;
}

.mutatio-unified-view table {
  width: 100%;
  border-collapse: collapse;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
}

.hunk-row {
  background-color: var(--diff-hunk-bg);
}

.hunk-collapsed {
  background: repeating-linear-gradient(
    -45deg,
    var(--diff-hunk-bg),
    var(--diff-hunk-bg) 4px,
    transparent 4px,
    transparent 8px
  );
}

.hunk-cell {
  padding: 10px 12px;
  user-select: none;
  color: var(--diff-hunk-color, inherit);
  opacity: 0.7;
}

.hunk-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hunk-text {
  flex: 1;
}

.expand-btn {
  font-size: 12px;
  color: var(--diff-link-color, #0969da);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.expand-btn:hover {
  text-decoration: underline;
}

.row-selected {
  background-color: var(--diff-selected-bg) !important;
}

.line-num {
  user-select: none;
  text-align: right;
  padding: 0 6px;
  color: var(--diff-line-num-color, rgba(0, 0, 0, 0.4));
  width: 2em;
  vertical-align: top;
  border-right: 1px solid var(--diff-border-color, #d1d9e0);
  cursor: pointer;
}

.line-num:hover {
  text-decoration: underline;
}

.diff-content {
  padding: 0 12px 0 0;
  padding-left: 2em;
  vertical-align: top;
}

.wrap-mode {
  white-space: pre-wrap;
  word-break: break-all;
}

.nowrap-mode {
  white-space: pre;
}

.diff-content :deep(.diff-marker) {
  display: inline-block;
  width: 1.5em;
  margin-left: -1.8em;
  text-align: center;
  user-select: none;
  font-weight: bold;
}
</style>
