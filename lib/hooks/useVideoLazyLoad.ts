'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useLoading } from '@/lib/contexts/LoadingContext';

/**
 * Hook to manage video playback using Intersection Observer.
 * - For videos with data-lazy-video: loads src from data-src when entering viewport
 * - For all videos: pauses when not visible to save resources
 * - Signals to LoadingContext when initial videos are ready
 */
export function useVideoLazyLoad() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { setVideosReady } = useLoading();
  const loadedCountRef = useRef(0);
  const hasSignaledRef = useRef(false);

  const checkVideosReady = useCallback(() => {
    // Signal ready after first 3 videos load (above-the-fold)
    if (loadedCountRef.current >= 3 && !hasSignaledRef.current) {
      hasSignaledRef.current = true;
      setVideosReady();
    }
  }, [setVideosReady]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Create intersection observer with generous margin for preloading
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;

            if (entry.isIntersecting) {
              // Load video if it has a lazy src
              if (video.dataset.src && !video.src) {
                video.src = video.dataset.src;
                video.load();

                // Track load completion
                video.addEventListener('canplaythrough', () => {
                  loadedCountRef.current++;
                  checkVideosReady();
                }, { once: true });

                // Fallback if video loads quickly
                if (video.readyState >= 3) {
                  loadedCountRef.current++;
                  checkVideosReady();
                }
              } else {
                // For non-lazy videos, still track as loaded
                loadedCountRef.current++;
                checkVideosReady();
              }

              // Play video when visible
              video.play().catch(() => {
                // Autoplay might be blocked, that's ok
              });
            } else {
              // Pause video when not visible to save resources
              video.pause();
            }
          });
        },
        {
          // Load/play videos when within 50% of viewport height
          rootMargin: '50% 0px',
          threshold: 0,
        }
      );

      // Observe ALL videos in the document (for play/pause management)
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((video) => observerRef.current?.observe(video));

      // If no videos found, immediately signal ready
      if (allVideos.length === 0) {
        setVideosReady();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [checkVideosReady, setVideosReady]);
}
