import { HistoryPlugin as LexicalHistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useEditorHistoryContext } from '../../context/useEditorHistoryContext';

export function HistoryPlugin() {
  const { historyState } = useEditorHistoryContext();
  return <LexicalHistoryPlugin externalHistoryState={historyState} />;
}
