import { useEffect, useRef } from 'react';

export function useHeightObserver(observe: boolean, onHeightChanged: (height: number) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    onHeightChanged(ref.current.clientHeight);

    // todo: missing type definitions for ResizeObserver / ResizeObserver might need a polyfill for older browsers
    // @ts-ignore
    let resizeObserver: ResizeObserver;

    // @ts-ignore
    if (observe && typeof ResizeObserver !== 'undefined') {
      // @ts-ignore
      resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];

        onHeightChanged(entry.contentRect.height);
      });

      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, [observe, onHeightChanged]);

  return ref;
}
