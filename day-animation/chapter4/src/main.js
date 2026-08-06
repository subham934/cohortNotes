import './style.css';
// import gsap from "gsap";

import { gsap } from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lesson1
const play =  document.querySelector(".play");
const pause =  document.querySelector(".pause");
const restart =  document.querySelector(".restart");
const reverse =  document.querySelector(".reverse");
const seek  = document.querySelector(".seek");

const box = document.querySelector(".box");
const box1 = document.querySelector(".box1");
const box2 = document.querySelector(".box2");
const box3 = document.querySelector(".box3");

const tl = gsap.timeline({paused: true}); // animation is paused

tl.to(box, {
  x: 1000,
  duration: 1.3,
  ease: "power1.inOut",
})
.to(box1, {
  x: 1000,
  duration: 1.3,
  ease: "power1.inOut",
}).to(box2, {
  x: 1000,
  duration: 1.3,
  ease: "power1.inOut",
})
.addLabel("swaraj")
.to(box3, {
  x: 1000,
  duration: 1.3,
  ease: "power1.inOut",
});

play.addEventListener("click", ()=> {
  tl.play()
})

pause.addEventListener("click", ()=> {
  tl.pause();
})

restart.addEventListener("click", ()=> {
  tl.restart();
})

reverse.addEventListener("click", ()=> {
  tl.reverse();
})

seek.addEventListener("click", () => {
  // tl.seek(2);
  // Moves the playhead to the 2-second mark of the timeline.
  // The timeline instantly jumps to the state it would be in at 2 seconds.
  
  tl.seek("swaraj");
  // Moves the playhead to the position of the "swaraj" label.
  // The timeline instantly jumps to the state at that label.
});

*/

/**
 * lesson2
// ====================================nested timeline====================================



// ------------------------
// LOADER TIMELINE
// ------------------------

function loadingTimeline() {

  const tl = gsap.timeline();

  tl.to(".loader", {
    delay: .5,
    yPercent: -100,
    duration: 1,
    ease: "power2.inOut"
  });

  return tl;
}


// ------------------------
// NAVBAR TIMELINE
// ------------------------

function navbarTimeline() {

  const tl = gsap.timeline();

  tl.from(".logo", {
    y: -50,
    opacity: 0,
    duration: 0.5
  });

  tl.from("nav li", {
    y: -50,
    opacity: 0,
    stagger: 0.15,
    duration: 0.5
  });

  return tl;
}


// ------------------------
// HERO TIMELINE
// ------------------------

function heroTimeline() {

  const tl = gsap.timeline();

  tl.from(".hero h1", {
    y: 100,
    opacity: 0,
    duration: 1
  });

  return tl;
}


// ------------------------
// MASTER TIMELINE
// ------------------------

const master = gsap.timeline();

master
  .add(loadingTimeline())
  .add(navbarTimeline())
  .add(heroTimeline());
  
*/



//  =======================================ScrollTrigger==============================

// gsap.to(".box",{
//   x: 1000,
//   duration: 1.3,
//   ease: "back.out",
//   delay: 1.9
// })
// here , the animation happens , after 1.9 seconds , it will start playing even we have scrolled to that page or not
// this is because  we have not attached it to the scroll
// To attach the animation to the scroll , we use ScrollTrigger




// gsap.to('.box', {
//   x: 800,
//   // duration: 1.3,
//   ease: "bounce.in",
//   scrollTrigger: {
//     trigger: '.page2',
//     // start: 'top 60%',
//     start: 'top top',
//     end: 'top -50%',
//     markers: true,
//     // scrub:2,
//     scrub:true,
//     pin:true,
//     onEnter: ()=>{},
//     onLeave: ()=>{},
//     onUpdate: ()=>{},
//     onEnterBack: ()=>{},
//     onLeaveBack: ()=>{},
//   },
// });


gsap.set(".imageDiv",{
  scale:0.3
})

gsap.set(".content",{
  gap: "85rem",

})

const tl = gsap.timeline({
    scrollTrigger: {
    trigger: '.page2',
    start: 'top top',
    end: 'top -50%',
    markers: true,
    scrub:true,
    pin:true,
  },
})

tl.to(".imageDiv",{
  scale:1,
  ease: "power2.inOut",

}).to(".content",{
  gap: "7rem",
  ease: "power2.inOut",
},"<")