import { FORMAT_TEXT_COMMAND, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { usePointer } from '../../../../hooks/usePointer';

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

export function useTextFormat({ editor }: { editor: LexicalEditor }): [TextFormatStates, TextFormatHandlers] {
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  // const [isLink, setIsLink] = useState<boolean>(false); //TODO: add Link button on toolbar
  const [isPointerDown] = usePointer();

  const updateTextFormat = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing() || isPointerDown) return;

      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // const nodes = selection.getNodes();
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
      }
    });
  }, [editor, isPointerDown]);

  useEffect(() => {
    return editor.registerUpdateListener(updateTextFormat);
  }, [editor, updateTextFormat]);

  useEffect(() => {
    updateTextFormat();
  }, [updateTextFormat]);

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

  return [states, handlers];
}
