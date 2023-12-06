import { ReactNode } from 'react';

interface CellProps {
  renderLabel: () => ReactNode;
  isOn: boolean;
  onClick: () => void;
}

function Cell({ isOn, onClick, renderLabel }: CellProps) {
  return (
    <button className={'px-1 hover:bg-gray-300 rounded-sm w-6 ' + (isOn ? 'bg-slate-300' : '')} onClick={onClick}>
      {renderLabel()}
    </button>
  );
}

interface ToolbarProps {
  cells: CellProps[];
}

export function Toolbar({ cells }: ToolbarProps) {
  return (
    <div className='bg-slate-200 space-x-1 rounded p-1'>
      {cells.map(cellProps => (
        <Cell {...cellProps} />
      ))}
    </div>
  );
}
