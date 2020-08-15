import { useEffect, useState } from 'react';

export function useHeightObserver(observe: boolean, onHeightChanged: (height: number) => void) {
  const [ref, setRef] = useState<HTMLElement>();

  useEffect(() => {
    if (!ref) return;

    onHeightChanged(ref.clientHeight);

    // todo: missing type definitions for ResizeObserver
    // todo: ResizeObserver might need a polyfill for older browsers
    // @ts-ignore
    let resizeObserver: ResizeObserver;

    // @ts-ignore
    if (observe && typeof ResizeObserver !== 'undefined') {
      // @ts-ignore
      resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];

        onHeightChanged(entry.contentRect.height);
      });

      resizeObserver.observe(ref);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, [ref, observe]);

  return setRef;
}
