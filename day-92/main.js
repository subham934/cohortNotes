const mouseFollower = document.querySelector(".mouse-follower");

// addEventListener("mousemove", (e) => {
//   const { clientX, clientY } = e;

//   //   mouseFollower.style.top = clientY + "px"
//   //   mouseFollower.style.left = clientX + "px"

//   //   this is much efficient code then previous one
//   //   mouseFollower.style.transform = `translate(${clientX}px, ${clientY}px)`;

// });

// function far() {
//   mouseFollower.style.transform = `translate(${clientX}px, ${clientY}px)`;
// }

// ==========================================
// we can also do this by using global variable and then call the function in event listener

// let x = 0;
// let y = 0;

// addEventListener("mousemove", (e) => {
//   const { clientX, clientY } = e;

//   x = clientX;
//   y = clientY;

//   far();
// });

// function far() {
//   mouseFollower.style.transform = `translate(${x}px, ${y}px)`;
// }

// ==========================================

// we can also do this by using requestAnimationFrame and then call the function in event listener

let x = 0;
let y = 0;

addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;

  x = clientX;
  y = clientY;
});

function far() {
  mouseFollower.style.transform = `translate(${x}px, ${y}px)`;
  requestAnimationFrame(far);
}

far();
