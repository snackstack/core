import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type HeightCallback = (newHeight: number) => void;

export function useHeightObserver(onHeightChanged: HeightCallback) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    onHeightChanged(ref.current.clientHeight);

    let resizeObserver: ResizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];

        onHeightChanged(entry.contentRect.height);
      });

      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, [onHeightChanged]);

  return ref;
}
