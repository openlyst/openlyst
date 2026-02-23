const URL_REGEX =
  /https?:\/\/[^\s<>"{}|\\^`[\]]+(?:[^\s<>"{}|\\^`[\].);:,!?]*)?/gi;

export type TextSegment = { type: 'text'; value: string } | { type: 'url'; value: string };

export function parseTextWithUrls(text: string): TextSegment[] {
  if (!text || typeof text !== 'string') return [];
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_REGEX.source, 'gi');
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'url', value: match[0] });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments.length ? segments : [{ type: 'text', value: text }];
}

export function extractUrls(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  const re = new RegExp(URL_REGEX.source, 'gi');
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return [...new Set(urls)];
}
