import './style.css';
import gsap from 'gsap';

/**
 * lesson1

gsap.to(".box",{
  x: 670,
  duration: 1.3,
  ease: "power2.out",
  delay:.6,
  // stagger:0.5
  // stagger: -0.4
  //if i want to stagger element to move from center
  stagger:{
    each: 0.2,
    // from:"center",
    from:"edges",
    // from:'random',
    grid: "auto"
  }
})

*/

/**
 *lesson2 
gsap.from('h1 span', {
  yPercent: 100,
  opacity: 0,
  duration: 1.5,
  // stagger: 0.08,
  // stagger: -0.08,
  ease: 'expo.out',
  stagger: {
    each: 0.08,
    grid: 'auto',
    from: 'edges',
  },
});



*/

/**
 * Lesson3

// gsap.to('.box1', {
  //   x: 670,
  //   duration: 1.3,
  //   ease: 'power2.out',
  //   delay: 0.6,
  // });
  
// gsap.to('.box2', {
  //   x: 670,
  //   duration: 1.3,
  //   ease: 'power2.out',
  //   delay: 1.9,
  // });
  
  // gsap.to('.box3', {
    //   x: 670,
    //   duration: 1.3,
//   ease: 'power2.out',
//   delay: 3.2,
// });

// gsap.to('.box4', {
  //   x: 670,
  //   duration: 1.3,
  //   ease: 'power2.out',
  //   delay: 4.5,
  // });
  
// to solve the above problem we use timeline

const tl = gsap.timeline();

// tl
// .to(".box1", {
  //   x: 670,
  //   duration: 1.3,
  //   ease: "power2.out",
  //   delay:.7,
  // })
  // .to(".box2", {
    //   x: 670,
    //   duration: 1.3,
    //   ease: "power2.out",
    // })
    // .to(".box3", {
      //   x: 670,
      //   duration: 1.3,
      //   ease: "power2.out",
      // })
      // .to(".box4", {
        //   x: 670,
        //   duration: 1.3,
        //   ease: "power2.out",
        // })
        
        //tl.to(element, {property}, position parameters)
        // types:
        // "<" or "previous"
        // ">"
        // "start" or "end"
        
        // tl.to('.box1', { x: 1000, duration: 1, delay: 1.5 })
        //   .to('.box2', { x: 1000, duration: 1 }, "<") // the starting time of box2 will be same as the starting time of box1
        //   .to('.box3', { x: 1000, duration: 1 }, "<0.3") // the starting time of box3 will be 0.3 sec after the starting time of box2
//   .to('.box4', { x: 1000, duration: 1 }, ">0.3") // the starting time of box4 will be 0.3 sec after the starting time of box3

// 1.5s  box1 start
// 1.5s  box2 start
// 1.8s  box3 start
// 2.8s  box3 end
// 3.1s  box4 start

// tl.to('.box1', {x:1000, duration:1, delay:1.5})
//   .to('.box2', {x:1000, duration:1}, '<') // the starting time of box2 will be same as the starting time of box1
//   .to('.box3', {x:1000, duration:1}, '<0.3') // the starting time of box3 will be 0.3 sec after the starting time of box2
//   .to('.box4', {x:1000, duration:1}, '-=0.7')

// 1.5s  box1 start
// 1.5s  box2 start
// 1.8s  box3 start
// 2.1s  box4 start
// 2.5s  box1 end
// 2.5s  box2 end
// 2.8s  box3 end
// 3.1s  box4 end

// if we write for .box4 as "+=0.7" it mean start the animation 0.7 sec after the previous animation end

tl.to('.box1', {
  x: 670,
  duration: 1.3,
  ease: 'power2.out',
})
.to(
  '.box2',
  {
    x: 670,
    duration: 1.3,
    ease: 'power2.out',
  },
  'raja'
)
.to('.box3', {
    x: 670,
    duration: 1.3,
    ease: 'power2.out',
  })
  .to(
    '.box4',
    {
      x: 670,
      duration: 1.3,
      ease: 'power2.out',
    },
    //  "raja" // box 2 and box 4 will run at the same time, as both have same label "raja",
    'raja-=0.2'
  ); //  if we want to make it move .2 sec faster then box 2 we write as "raja-=0.2"
  
  */

let count = 0;

const loaderCounter = document.querySelector('.loaderCount h1');

const interval = setInterval(() => {
  count++;
  loaderCounter.innerHTML = `${count}%`;
  if (count == 100) {
    clearInterval(interval);
    landingAnimation();
  }
}, 20);

function landingAnimation() {
  const tl = gsap.timeline();

  tl.to('.loaderCount', {
    opacity: 0,
    duration: 1.7,
    ease: 'power2.out',
  })
    .to('.loader', {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.out',
    }, "-=0.9")
    .from('.background img', {
      scale: 1.25,
      duration: 1.6,
      ease: 'expo.out',
    }, "-=1.1")
    .from('.heading h1', {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
    }, "-=0.8")
    .from('.subheading h2', {
      yPercent: 100,
      opacity: 0,
      duration: .5,
      ease: 'expo.out',
    }, "-=0.77");
}
