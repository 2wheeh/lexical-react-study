import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createPortal } from 'react-dom';
import { TextFormatContext, useTextFormat } from './TextFormatContext';

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
