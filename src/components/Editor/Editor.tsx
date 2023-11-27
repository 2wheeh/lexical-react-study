import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { LocalStoragePlugin } from './plugins/LocalStorage';

interface LexicalEditorProps {
  config: InitialConfigType;
}

function LexicalEditor({ config }: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={config}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={
          <div className='absolute top-[1.125rem] left-[1.125rem] opacity-50 pointer-events-none'>
            Start writing ...
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LocalStoragePlugin namespace={config.namespace} />
    </LexicalComposer>
  );
}

const EDITOR_NAMESPACE = 'lexical-editor';

export function Editor() {
  const content = localStorage.getItem(EDITOR_NAMESPACE);

  return (
    <div
      id='editor-wrapper'
      className='relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2'
    >
      <LexicalEditor
        config={{
          namespace: EDITOR_NAMESPACE,
          editorState: content,
          theme: {
            root: 'p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black',
            link: 'cursor-pointer',
            text: {
              bold: 'font-semibold',
              underline: 'underline',
              italic: 'italic',
              strikethrough: 'line-through',
              underlineStrikethrough: 'underlined-line-through',
            },
          },
          onError: error => {
            console.log(error);
          },
        }}
      />
    </div>
  );
}
