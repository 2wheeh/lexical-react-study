import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND, LexicalEditor } from 'lexical';
import { useEffect, useState } from 'react';

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

export function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, { clear }] = useClear(editor);

  return (
    <>
      {/* // TODO: replace <button /> with wrapped component <Button /> */}
      <button
        className='my-2 p-2 rounded bg-slate-200 opacity-70 disabled:bg-slate-400'
        disabled={isEditorEmpty}
        onClick={clear}
      >
        <p>clear</p>
      </button>
    </>
  );
}
