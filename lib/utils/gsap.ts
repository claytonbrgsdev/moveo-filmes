/**
 * Centralized GSAP registration.
 *
 * Import gsap and ScrollTrigger from this module instead of calling
 * gsap.registerPlugin(ScrollTrigger) in every component. GSAP is a
 * singleton — registering the plugin multiple times is harmless but
 * generates internal checks and console warnings.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
