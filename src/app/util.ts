export function timeBlock<R>(label: string, block: () => R): [R, number] {
  const start = performance.now();
  const duration = () => performance.now() - start;
  return [block(), duration()];
}
