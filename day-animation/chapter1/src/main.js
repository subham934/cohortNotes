import './style.css';
import gsap from 'gsap';

const box = document.querySelector('.box');

// gsap.to(box, {
//   x: 100,
//   y: "10rem",
//   duration: 3.25,
//   delay: 1,
//   ease: 'power4.out',
//   // repeat:-1,
//   // yoyo:true,
// });



// gsap.from(box, {
//   x: 100,
//   y: "10rem",
//   duration: 3.25,
//   delay: 1,
//   ease: 'power4.out',
//   // repeat:-1,
//   // yoyo:true,
// });



// gsap.fromTo(box,{
//   x:100,
// },{
//   //always wirte duration and delay here in this bracket
//   x:1000,
//   duration:1.4,
//   delay:0.9,
//   ease:"power3.out"
// })



const obj = {
  a:0,
  x:0,
}

gsap.to(obj,{
  x:300,
  a:100,
  duration:2.4,
  delay:3.9,
  ease:"power1.out",
  onUpdate: () => {
    console.log(obj.a);
    box.style.backgroundColor = `rgb(${obj.a}, ${obj.a - 10}, ${obj.a - 70})`;
    box.style.transform = `translateX(${obj.x}px)`
  }
})
