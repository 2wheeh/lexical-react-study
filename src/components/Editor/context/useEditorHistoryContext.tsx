import type { HistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { ReactNode, createContext, useContext, useMemo } from 'react';

type EditorHistoryContext = {
  historyState?: HistoryState;
};

const Context = createContext<EditorHistoryContext>({});

export function EditorHistoryContext({ children }: { children: ReactNode }): JSX.Element {
  const historyContext = useMemo(
    () => ({
      historyState: createEmptyHistoryState(),
    }),
    []
  );

  return <Context.Provider value={historyContext}>{children}</Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEditorHistoryContext(): EditorHistoryContext {
  return useContext(Context);
}
