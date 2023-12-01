import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorNodes from './nodes/EditorNodes';

import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LocalStoragePlugin, retrieveContent } from './plugins/LocalStorage';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from './plugins/AutoLink';
import { MarkdownShortcutPlugin } from './plugins/MarkdownShortcut';
import { ActionsPlugin } from './plugins/Actions';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { EditorHistoryContext } from './context/useEditorHistoryContext';
import { HistoryPlugin } from './plugins/History';
import { ToolbarPlugin } from './plugins/Toolbar';
import { useState } from 'react';

const useAnchor = (): [HTMLDivElement | null, (divElem: HTMLDivElement) => void] => {
  const [anchorElem, setAnchorElem] = useState<HTMLDivElement | null>(null);
  const onAnchorRef = (_anchorElem: HTMLDivElement) => {
    if (_anchorElem !== null) {
      setAnchorElem(_anchorElem);
    }
  };

  return [anchorElem, onAnchorRef];
};

interface LexicalEditorProps {
  config: InitialConfigType;
}

function LexicalEditor({ config }: LexicalEditorProps) {
  const [anchorElem, onAnchorRef] = useAnchor();

  return (
    <LexicalComposer initialConfig={config}>
      <RichTextPlugin
        contentEditable={
          <div ref={onAnchorRef}>
            <ContentEditable />
          </div>
        }
        placeholder={
          <div className='absolute top-[1.125rem] left-[1.125rem] opacity-50 pointer-events-none'>
            Start writing ...
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LocalStoragePlugin namespace={config.namespace} />
      <MarkdownShortcutPlugin />
      <LinkPlugin />
      <ListPlugin />
      <AutoLinkPlugin />
      <ClearEditorPlugin />
      <ActionsPlugin />
      <>{anchorElem && <ToolbarPlugin anchorElem={anchorElem} />}</>
    </LexicalComposer>
  );
}

const EDITORS_NODES = [...EditorNodes];
const EDITOR_NAMESPACE = 'lexical-editor';

export function Editor() {
  return (
    <div
      id='editor-wrapper'
      className='relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 prose-headings:font-normal'
    >
      <EditorHistoryContext>
        <LexicalEditor
          config={{
            namespace: EDITOR_NAMESPACE,
            editorState: retrieveContent(EDITOR_NAMESPACE),
            nodes: EDITORS_NODES,
            theme: {
              root: 'p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black',
              link: 'cursor-pointer',
              text: {
                bold: 'font-semibold',
                italic: 'italic',
                strikethrough: 'line-through',
                underline: 'underline',
                underlineStrikethrough: 'underlined-line-through',
              },
              list: {
                listitem: '',
                // TODO: nested, ol, ul, ...
              },
            },
            onError: error => {
              console.log(error);
            },
          }}
        />
      </EditorHistoryContext>
    </div>
  );
}
