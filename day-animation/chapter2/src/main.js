import './style.css';
import gsap from 'gsap';

// gsap.to(".box",{
//     x:1000,
//     duration:1,
//     delay:0.8,
//     repeat:-1,
//     yoyo:true,
//     ease:"power4.out",
// })

// gsap.set('.box', {
//   x: -300,
// });

// gsap.to('.box', {
//   x: 1800,
//   duration: 1.5,
//   delay: 0.8,
//   ease: 'power2.out',
//   repeat: -1,
// });

gsap.to(".box",{
    x:500,
    duration:1.4,
    delay:0.8,
    ease:"power2.inOut",

    onStart: ()=>{
        console.log("animation started")
    },
    onComplete: ()=>{
        console.log("animation completed")
    },

    onUpdate:()=>{
        console.log("animation is updating")
    }
})