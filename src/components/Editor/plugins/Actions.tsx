import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';

export function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleClick = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    // editor.focus();
  };

  return (
    <>
      {/* // TODO: replace <button /> with wrapped component <Button /> */}
      <button className='my-2 p-2 rounded bg-slate-200 opacity-70' onClick={handleClick}>
        <p>clear</p>
      </button>
    </>
  );
}
