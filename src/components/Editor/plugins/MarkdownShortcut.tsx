import { MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS, CODE, INLINE_CODE } from '@lexical/markdown';
import { removeElements } from '../../../utils/removeElements';

const NO_USE = [CODE, INLINE_CODE];
const CUSTOM_TRANSFORMERS = removeElements(TRANSFORMERS, NO_USE);

export function MarkdownShortcutPlugin() {
  return <LexicalMarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />;
}
