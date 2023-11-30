import { FORMAT_TEXT_COMMAND, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

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

export function TextFormatContext({ children, editor }: { children: ReactNode; editor: LexicalEditor }) {
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

// eslint-disable-next-line react-refresh/only-export-components
export function useTextFormat() {
  return useContext(textFormatContext);
}
