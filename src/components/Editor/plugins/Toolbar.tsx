import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface TextFormatStates {
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
}

interface TextFormatHandlers {
  bold: () => void;
  italic: () => void;
  strikethrough: () => void;
  underline: () => void;
}

interface ContextShape {
  states?: TextFormatStates;
  handlers?: TextFormatHandlers;
}

const textFormatContext = createContext<ContextShape>({});

function TextFormatContext({ children, editor }: { children: ReactNode; editor: LexicalEditor }) {
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  // const [isLink, setIsLink] = useState<boolean>(false); //TODO: add Link button on toolbar

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

  const states: TextFormatStates = {
    isBold,
    isItalic,
    isStrikethrough,
    isUnderline,
  };

  const handlers: TextFormatHandlers = {
    bold: () => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    },
    italic: () => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    },
    strikethrough: () => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    },
    underline: () => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    },
  };

  return <textFormatContext.Provider value={{ states, handlers }}>{children}</textFormatContext.Provider>;
}

function useTextFormat() {
  return useContext(textFormatContext);
}

function Toolbar() {
  const { states, handlers } = useTextFormat();

  return (
    <div className='bg-slate-200 absolute top-1 left-1 space-x-1 rounded-sm p-1'>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 font-bold ' + (states?.isBold ? 'bg-slate-300' : '')}
        onClick={handlers?.bold}
      >
        B
      </button>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 italic ' + (states?.isItalic ? ' bg-slate-300' : '')}
        onClick={handlers?.italic}
      >
        I
      </button>
      <button
        className={
          'px-1 hover:bg-gray-300 rounded-sm w-6 line-through ' + (states?.isStrikethrough ? 'bg-slate-300' : '')
        }
        onClick={handlers?.strikethrough}
      >
        S
      </button>
      <button
        className={'px-1 hover:bg-gray-300 rounded-sm w-6 underline ' + (states?.isUnderline ? 'bg-slate-300' : '')}
        onClick={handlers?.underline}
      >
        U
      </button>
    </div>
  );
}

export function ToolbarPlugin({ anchorElem = document.body }: { anchorElem?: HTMLElement }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  return <TextFormatContext editor={editor}>{createPortal(<Toolbar />, anchorElem)}</TextFormatContext>;
}
