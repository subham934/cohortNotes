import './style.css';
import { gsap } from 'gsap';

import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(Draggable, Flip, InertiaPlugin, ScrollTrigger, SplitText);

/**
 * 
 * lesson1
// let split = new SplitText( ".title p", {
  let split = new SplitText( ".title h1", {
  type: 'chars, words, lines',
  wordsClass: 'titleWord'
});

// gsap.from(split.chars, {
  // gsap.from(split.lines, {
gsap.from(split.chars, {
  opacity: 0,
  yPercent: 100,
  duration: 1,
  ease: 'expo.out',
  stagger: {
    each: 0.05,
    from: 'center',
  },
});

*/

/**
 *lesson2 

Draggable.create(".box", {
  bounds: "#app", // Restricts the box to stay within the #app container

  // type: "x",   // Allows dragging only on the X-axis (horizontal)
  // type: "y",   // Allows dragging only on the Y-axis (vertical)
  type: "x,y",    // Allows dragging on both axes (this is the default)

  edgeResistance: 0.5, // Makes it harder to drag beyond the bounds.
  // A value of 0 = no resistance, 1 = maximum resistance.
  
  inertia: true, // Requires InertiaPlugin.
  // Continues movement after release based on drag velocity,
  // then gradually slows down.
  
  dragResistance: 0.2 // Reduces movement while dragging.
                      // 0 = no resistance, 1 = maximum resistance.
                      // 0.2 means the element follows the cursor with 20% resistance.
});


*/

const img = document.querySelector('.specialImage');
const img2 = document.querySelector('.specialImage2');

img.addEventListener('click', () => {
  const state = Flip.getState(img);
  const state2 = Flip.getState(img2);

  document.querySelector('.imageGallery').appendChild(img2);
  document.querySelector('.imageShow').appendChild(img);

  Flip.from(state, {
    duration: 0.8,
    ease: 'power3.inOut',
    absolute: true,
    scale:true
  });

  Flip.from(state2, {
    duration: 0.8,
    ease: 'power3.inOut',
    absolute: true,
    scale:true
  });
});
