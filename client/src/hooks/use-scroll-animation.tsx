import { useEffect, useRef, useState } from 'react';

type ScrollAnimationOptions = {
  threshold?: number;
  delay?: number;
};

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, delay = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, isVisible]);

  return { ref, isVisible };
}
