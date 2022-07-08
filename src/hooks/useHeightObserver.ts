import { useEffect, useRef } from 'react';

// todo: maybe requires polyfill for ResizeObserver
export function useHeightObserver(observe: boolean, onHeightChanged: (height: number) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    onHeightChanged(ref.current.clientHeight);

    let resizeObserver: ResizeObserver;

    if (observe && typeof ResizeObserver !== 'undefined') {
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
