import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { usePointer } from '../../../../hooks/usePointer';

export const useTargetRect = (editor: LexicalEditor) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isPointerdown] = usePointer();

  const updateTargetRect = useCallback(() => {
    editor.getEditorState().read(() => {
      // if (editor.isComposing() || isPointerdown) return;
      if (isPointerdown) return;

      const selection = $getSelection();
      const nativeSelection = window.getSelection();

      // nativeSelection이 editor 안의 요소 인지 확인할 떄 사용
      const rootElement = editor.getRootElement();

      if (
        !$isRangeSelection(selection) ||
        nativeSelection === null ||
        nativeSelection.isCollapsed ||
        rootElement === null
      ) {
        setTargetRect(null);
        return;
      }

      if (rootElement.contains(nativeSelection.anchorNode)) {
        const rangeRect = nativeSelection.getRangeAt(0).getBoundingClientRect();
        setTargetRect(rangeRect);
      }
    });
  }, [editor, isPointerdown]);

  useEffect(() => {
    return editor.registerUpdateListener(updateTargetRect);
  }, [editor, updateTargetRect]);

  useEffect(() => {
    updateTargetRect();
  }, [updateTargetRect]);

  return targetRect;
};
