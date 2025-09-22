// Temporary simplified version for Next.js compatibility
import type { ElementName } from "./constants";

// We'll implement a simplified version of the content model checking
// This is a temporary solution until we resolve the import issues

const FLOW_CONTENT = new Set([
  'a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'blockquote', 'br', 'button',
  'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'em',
  'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup',
  'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'main', 'map', 'mark', 'meter', 'nav',
  'noscript', 'object', 'ol', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'ruby', 's', 'samp',
  'script', 'section', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'table', 'template',
  'textarea', 'time', 'u', 'ul', 'var', 'video', 'wbr'
]);

const PHRASING_CONTENT = new Set([
  'a', 'abbr', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist',
  'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'mark',
  'meter', 'noscript', 'object', 'output', 'picture', 'progress', 'q', 'ruby', 's', 'samp', 'script',
  'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'template', 'textarea', 'time', 'u',
  'var', 'video', 'wbr'
]);

// Simple content model rules
const CONTENT_MODEL_RULES: Record<string, string[]> = {
  'html': ['head', 'body'],
  'head': ['title', 'base', 'link', 'meta', 'script', 'style'],
  'body': Array.from(FLOW_CONTENT),
  'div': Array.from(FLOW_CONTENT),
  'p': Array.from(PHRASING_CONTENT),
  'span': Array.from(PHRASING_CONTENT),
  'ul': ['li'],
  'ol': ['li'],
  'li': Array.from(FLOW_CONTENT),
  'section': Array.from(FLOW_CONTENT),
  'article': Array.from(FLOW_CONTENT),
  'aside': Array.from(FLOW_CONTENT),
  'nav': Array.from(FLOW_CONTENT),
  'header': Array.from(FLOW_CONTENT),
  'footer': Array.from(FLOW_CONTENT),
  'main': Array.from(FLOW_CONTENT),
  'h1': Array.from(PHRASING_CONTENT),
  'h2': Array.from(PHRASING_CONTENT),
  'a': Array.from(PHRASING_CONTENT).filter(tag => tag !== 'a'), // a cannot contain a
  'button': Array.from(PHRASING_CONTENT).filter(tag => !['a', 'button', 'input', 'select', 'textarea'].includes(tag)),
};

export function checkNext(currentField: ElementName[], nextElement: ElementName): boolean {
  if (currentField.length === 0) {
    // First card, most elements can be played
    return true;
  }

  const lastElement = currentField[currentField.length - 1];
  const allowedChildren = CONTENT_MODEL_RULES[lastElement] || Array.from(FLOW_CONTENT);
  
  return allowedChildren.includes(nextElement);
}

export function formatHtml(elements: ElementName[], indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  let result = '';
  
  for (const element of elements) {
    result += `${indentStr}<${element}></${element}>\n`;
  }
  
  return result.trim();
}

// Placeholder functions for compatibility
export const getContentModel = (elementName: ElementName) => {
  return CONTENT_MODEL_RULES[elementName] || [];
};

export function isStringArray(arr: readonly unknown[]): arr is string[] | readonly string[] {
  return arr.every((item) => typeof item === "string");
}

export const getTransparentContentModel = (): string[] => {
  return [];
};