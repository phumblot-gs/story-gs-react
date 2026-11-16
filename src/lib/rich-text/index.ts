/**
 * `@gs/gs-components-library/rich-text`: the rich text document of `RichTextEditor` and
 * its closed schema, as pure functions. No React, no DOM, no Tiptap, no CSS: usable in
 * Node 20 (API rendering an email) as well as in the browser (preview).
 */
export type {
  RichTextIssue,
  RichTextMark,
  RichTextNode,
  RichTextValue,
  RichTextValues,
  RichTextVariable,
  RichTextVariableKind,
} from "./types";
export {
  RICH_TEXT_BLOCKS,
  RICH_TEXT_INLINES,
  RICH_TEXT_MARKS,
  richTextEmptyDocument,
  richTextIsEmpty,
  richTextSanitize,
  richTextValidate,
  type RichTextValidateOptions,
} from "./schema";
export { richTextToHtml, richTextToPlainText, type RichTextInlineStyles, type RichTextToHtmlOptions } from "./render";
export {
  RICH_TEXT_VARIABLE_TOKEN,
  richTextFromTemplateString,
  richTextRenderTemplateString,
  richTextToTemplateString,
} from "./template";
export { RICH_TEXT_LINK_PROTOCOLS, richTextNormalizeUrl, richTextSafeHref } from "./url";
