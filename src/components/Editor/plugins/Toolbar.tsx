import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToolbarProps {
  editor: LexicalEditor;
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  // isLink: boolean;
}

function Toolbar({ editor, isBold, isItalic, isStrikethrough, isUnderline /* isLink */ }: ToolbarProps) {
  return (
    <div className='bg-slate-200 absolute top-1 left-1 space-x-1 rounded-sm p-1'>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 font-bold ' + (isBold ? 'bg-slate-300' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      >
        B
      </button>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 italic ' + (isItalic ? ' bg-slate-300' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      >
        I
      </button>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 line-through ' + (isStrikethrough ? 'bg-slate-300' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
      >
        S
      </button>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 underline ' + (isUnderline ? 'bg-slate-300' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      >
        U
      </button>
    </div>
  );
}

function useToolbar(editor: LexicalEditor, anchorElem: HTMLElement) {
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  // const [isLink, setIsLink] = useState<boolean>(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        if (editor.isComposing()) return;

        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          // const nodes = selection.getNodes();
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
          setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
      });
    });
  }, [editor]);

  return createPortal(
    <Toolbar
      editor={editor}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isUnderline={isUnderline}
    />,
    anchorElem
  );
}

export function ToolbarPlugin({ anchorElem = document.body }: { anchorElem?: HTMLElement }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useToolbar(editor, anchorElem);
}
