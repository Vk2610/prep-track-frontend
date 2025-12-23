import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * SmoothScroll Component
 * Implements butter-smooth scrolling using Lenis library
 * Wraps the entire application to provide premium scroll experience
 */
const SmoothScroll = ({ children }) => {
    useEffect(() => {
        // Initialize Lenis with optimized settings for speed
        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), // easeInOutCubic - snappier
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.5,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Animation frame loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup
        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
