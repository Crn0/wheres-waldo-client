import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler = () => {}, done = false) {
  useEffect(() => {
    const listener = (e) => {
      if ((!ref.current || ref.current.contains(e.target)) && !done) return;

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [done, handler, ref]);
}
