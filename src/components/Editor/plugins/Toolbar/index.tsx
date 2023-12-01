import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createPortal } from 'react-dom';
import { useTextFormat } from './useTextFormat';
import { LexicalEditor } from 'lexical';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useTargetRect } from './useTargetRect';

function Toolbar({ editor }: { editor: LexicalEditor }) {
  const [states, handlers] = useTextFormat({ editor });

  return (
    <div className='bg-slate-200 space-x-1 rounded p-1'>
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

const VERTICAL_GAP = 10;
const RIGHT_GAP = 10;

// target: selected node
// content: toolbar
// anchor: editor
function FloatingContainer({
  children,
  anchorElem,
  targetRect,
}: {
  children: ReactNode;
  anchorElem: HTMLElement;
  targetRect: DOMRect;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHight, setContentHight] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const { height, width } = contentRef.current.getBoundingClientRect();
    setContentHight(height);
    setContentWidth(width);
  }, []);

  const anchorElementRect = anchorElem.getBoundingClientRect();

  let containerX = 0;
  let containerY = 0;

  containerX = targetRect.left;
  containerY = targetRect.top - contentHight - VERTICAL_GAP;

  if (containerY < anchorElementRect.top) {
    containerY = targetRect.bottom + VERTICAL_GAP;
  }

  if (containerX + contentWidth + RIGHT_GAP > anchorElementRect.left + anchorElementRect.width) {
    containerX += anchorElementRect.left + anchorElementRect.width - containerX - contentWidth - RIGHT_GAP;
  }

  containerX -= anchorElementRect.left;
  containerY -= anchorElementRect.top;

  return createPortal(
    <div className={'absolute left-0 top-0'} style={{ transform: `translate3d(${containerX}px, ${containerY}px, 0)` }}>
      <div ref={contentRef}>{children}</div>
    </div>,
    anchorElem
  );
}

export function ToolbarPlugin({ anchorElem = document.body }: { anchorElem?: HTMLElement }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const targetRect = useTargetRect(editor);

  if (targetRect === null) return null;

  return (
    <FloatingContainer anchorElem={anchorElem} targetRect={targetRect}>
      <Toolbar editor={editor} />
    </FloatingContainer>
  );
}
