import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalIsTextContentEmpty } from '@lexical/react/useLexicalIsTextContentEmpty';
import { mergeRegister } from '@lexical/utils';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  LexicalEditor,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useEffect, useState } from 'react';
import { Button } from '../../../Button';

function useClear(editor: LexicalEditor): [boolean, { clear: () => void }] {
  const isEditorEmpty = useLexicalIsTextContentEmpty(editor);

  const handler = {
    clear: () => {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    },
  };

  return [isEditorEmpty, handler];
}

function useHistory(editor: LexicalEditor): [boolean, boolean, { undo: () => void; redo: () => void }] {
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false; // Return true to stop propagation. (in case there are some other listeners to same COMMAND)
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);

  const handlers = {
    undo: () => {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    },

    redo: () => {
      editor.dispatchCommand(REDO_COMMAND, undefined);
    },
  };

  return [canUndo, canRedo, handlers];
}

export function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, { clear }] = useClear(editor);
  const [canUndo, canRedo, { undo, redo }] = useHistory(editor);

  return (
    <div className='space-x-1'>
      <Button disabled={isEditorEmpty} onClick={clear}>
        <p>clear</p>
      </Button>
      <Button disabled={!canUndo} onClick={undo}>
        <p>undo</p>
      </Button>
      <Button disabled={!canRedo} onClick={redo}>
        <p>redo</p>
      </Button>
    </div>
  );
}
