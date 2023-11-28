import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useEditorHistoryContext } from '../context/useEditorHistoryContext';

export default function LexicalHistoryPlugin() {
  const { historyState } = useEditorHistoryContext();
  return <HistoryPlugin externalHistoryState={historyState} />;
}
