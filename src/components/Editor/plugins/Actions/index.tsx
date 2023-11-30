import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND, LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';
import { useEditorHistoryContext } from '../../context/useEditorHistoryContext';

function useClear(editor: LexicalEditor): [boolean, { clear: () => void }] {
  const [isEditorEmpty, setIsEditorEmpty] = useState<boolean>(true);

  useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
            return;
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        });
      });
    },
    [editor]
  );

  const handler = {
    clear: () => {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      // editor.focus();
    },
  };

  return [isEditorEmpty, handler];
}

function useHistory(editor: LexicalEditor): [boolean, boolean, { undo: () => void; redo: () => void }] {
  const { historyState } = useEditorHistoryContext();

  const { undoStack, redoStack } = historyState ?? {};
  const [hasUndo, setHasUndo] = useState<boolean>(undoStack?.length !== 0);
  const [hasRedo, setHasRedo] = useState<boolean>(redoStack?.length !== 0);

  useEffect(
    function checkEditorHistoryActions() {
      return editor.registerUpdateListener(() => {
        setHasRedo(redoStack?.length !== 0);
        setHasUndo(undoStack?.length !== 0);
      });
    },
    [editor, undoStack, redoStack]
  );

  const handlers = {
    undo: () => {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    },

    redo: () => {
      editor.dispatchCommand(REDO_COMMAND, undefined);
    },
  };
  return [hasUndo, hasRedo, handlers];
}

export function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, { clear }] = useClear(editor);
  const [hasUndo, hasRedo, { undo, redo }] = useHistory(editor);

  return (
    <div className='space-x-1'>
      {/* // TODO: replace <button /> with wrapped component <Button />  */}
      <button
        className='my-2 p-2 rounded bg-slate-200 opacity-70 disabled:opacity-30'
        disabled={isEditorEmpty}
        onClick={clear}
      >
        <p>clear</p>
      </button>
      <button
        className='my-2 p-2 rounded bg-slate-200 opacity-70 disabled:opacity-30'
        disabled={!hasUndo}
        onClick={undo}
      >
        <p>undo</p>
      </button>
      <button
        className='my-2 p-2 rounded bg-slate-200 opacity-70 disabled:opacity-30'
        disabled={!hasRedo}
        onClick={redo}
      >
        <p>redo</p>
      </button>
    </div>
  );
}
