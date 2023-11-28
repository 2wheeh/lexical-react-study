export function removeElements<T>(sourceArray: Array<T>, elementsToRemove: Array<T>) {
  const setToRemove = new Set(elementsToRemove);
  return sourceArray.filter(v => !setToRemove.has(v));
}
