import {
  type DiffFile,
  DiffLineType,
  escapeHtml,
  getSyntaxLineTemplate,
} from '@git-diff-view/core';

export function markerPrefix(type?: DiffLineType): string {
  const isAdd = type === DiffLineType.Add;
  const isDel = type === DiffLineType.Delete;
  const marker = isAdd ? '+' : isDel ? '-' : ' ';
  const cssVar = isAdd
    ? 'var(--diff-add-marker-color)'
    : isDel
      ? 'var(--diff-del-marker-color)'
      : '';
  return `<span class="diff-marker" style="color: ${cssVar}">${marker}</span>`;
}

export function contentBg(type?: DiffLineType): string {
  if (type === DiffLineType.Add) {
    return 'var(--diff-add-bg)';
  }
  if (type === DiffLineType.Delete) {
    return 'var(--diff-del-bg)';
  }
  return '';
}

export function numBg(type?: DiffLineType): string {
  if (type === DiffLineType.Add) {
    return 'var(--diff-add-num-bg)';
  }
  if (type === DiffLineType.Delete) {
    return 'var(--diff-del-num-bg)';
  }
  return '';
}

export function buildContentHtml(
  diffFile: DiffFile,
  lineNumber: number | undefined,
  value: string | undefined,
  type: DiffLineType | undefined,
  side: 'old' | 'new',
): string {
  if (!lineNumber) {
    return '';
  }

  const prefix = markerPrefix(type);
  const syntaxLine =
    side === 'old' ? diffFile.getOldSyntaxLine(lineNumber) : diffFile.getNewSyntaxLine(lineNumber);

  if (syntaxLine) {
    const template = getSyntaxLineTemplate(syntaxLine);
    if (template) {
      return prefix + template;
    }
  }

  return prefix + escapeHtml(value ?? '');
}
