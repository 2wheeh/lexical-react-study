import { ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {}

export function Button(props: ButtonProps) {
  return <button className={'my-2 p-2 rounded bg-slate-200 opacity-70 disabled:opacity-30'} {...props} />;
}
