import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { EditorState, LexicalEditor, $getRoot, $insertNodes } from 'lexical';
import { InitialEditorStateType } from '@lexical/react/LexicalComposer';

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

  // serialize to html
  const serializeState = useCallback(
    (editorState: EditorState) => {
      return editorState.read(() => $generateHtmlFromNodes(editor, null));
    },
    [editor]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, dirtyLeaves, editorState }) => {
      // Don't update if nothing has changed
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      const serializedState = serializeState(editorState);
      saveContent(serializedState); // TODO: need to be debounced
    });
  }, [editor, saveContent, serializeState]);

  return null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function retrieveContent(namespace: string): InitialEditorStateType {
  const content = localStorage.getItem(namespace);
  if (!content) return null;

  // html to EditorState
  return function deserializeState(editor: LexicalEditor) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(content, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);

    $getRoot().select();
    $insertNodes(nodes);
  };
}
