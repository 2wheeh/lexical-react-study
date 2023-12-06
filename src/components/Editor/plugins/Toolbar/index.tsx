import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createPortal } from 'react-dom';
import { TextFormatType, useTextFormat } from './useTextFormat';
import { LexicalEditor } from 'lexical';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useTargetRect } from './useTargetRect';
import { Toolbar } from '../../../Toolbar';

const TextFormatTypesToRender: Array<TextFormatType> = ['bold', 'italic', 'strikethrough', 'underline'];

function TextFormatToolbar({ editor }: { editor: LexicalEditor }) {
  const typesMap = useTextFormat(editor);
  const textFormatClass = (type: TextFormatType) => {
    switch (type) {
      case 'bold':
        return 'font-bold';
      case 'italic':
        return 'italic';
      case 'strikethrough':
        return 'line-through';
      case 'underline':
        return 'underline';
    }
  };

  const cells: /* Array<CellProps> */ Parameters<typeof Toolbar>[0]['cells'] = TextFormatTypesToRender.map(type => ({
    renderLabel: () => <span className={textFormatClass(type)}>{type[0].toUpperCase()}</span>,
    isOn: typesMap[type].state,
    onClick: typesMap[type].handler,
  }));

  return <Toolbar cells={cells} />;
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
      <TextFormatToolbar editor={editor} />
    </FloatingContainer>
  );
}
