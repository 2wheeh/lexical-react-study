import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

interface LexicalEditorProps {
  config: InitialConfigType;
}

export function LexicalEditor({ config }: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={config}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div className='absolute top-[1.125rem] left-[1.125rem] opacity-50'>Start writing ...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}

export function Editor() {
  return (
    <div
      id='editor-wrapper'
      className='relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2'
    >
      <LexicalEditor
        config={{
          namespace: 'lexical-editor',
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
