import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  const container = document.querySelector('.scroll-container');
  const panels = gsap.utils.toArray('.panel');

  if (!container) return;

  // 1. Create the master horizontal scroll animation
  // This translates the entire container to the left by its scrollable width
  const scrollTween = gsap.to(container, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.scroll-container',
      pin: true,
      scrub: 1,
      // The scrolling duration is equal to the horizontal scroll distance
      end: () => `+=${container.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    }
  });

  // 2. Animate the giant text using containerAnimation
  // This translates the 120rem text horizontally at a different speed (parallax effect)
  // as Section 2 enters and leaves the viewport.
  gsap.fromTo('.giant-text', 
    { x: '10%' },
    {
      x: '-65%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-2',
        containerAnimation: scrollTween,
        start: 'left right', // starts when section 2's left edge enters screen right
        end: 'right left',   // ends when section 2's right edge leaves screen left
        scrub: true,
      }
    }
  );

  // 3. Animate panel contents to fade and slide up when each panel comes into view
  panels.forEach((panel, index) => {
    const content = panel.querySelector('.panel-content');
    if (!content) return;

    if (index === 0) {
      // For the first panel (Introduction), animate immediately on page load
      gsap.from(content, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    } else {
      // For subsequent panels, trigger when the panel scrolls into view
      gsap.from(content, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 70%', // starts when the panel is 30% visible in the viewport
          toggleActions: 'play none none reverse',
        }
      });
    }
  });
});
