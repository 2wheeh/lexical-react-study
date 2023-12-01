import { useEffect, useState } from 'react';

export function usePointer() {
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);

  const handlePointerDown = () => {
    setIsPointerDown(true);
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return [isPointerDown];
}
