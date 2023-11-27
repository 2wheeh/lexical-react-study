import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface LocalStoragePluginProps {
  namespace: string;
}

export function LocalStoragePlugin({ namespace }: LocalStoragePluginProps) {
  const [editor] = useLexicalComposerContext();

  const saveContent = useCallback(
    (content: string) => {
      localStorage.setItem(namespace, content);
    },
    [namespace]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, dirtyLeaves, editorState }) => {
      // Don't update if nothing has changed
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      const serializedState = JSON.stringify(editorState);
      saveContent(serializedState); // TODO: need to be debounced when it fetches APIs
    });
  }, [editor, saveContent]);

  return null;
}
