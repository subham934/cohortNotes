// 20LPA-30LPA= MERN, DSA, DevOps, System Design, (Connections + achievements)

var img = document.querySelector("img");

var love = document.querySelector("i");

// img.addEventListener("dblclick", () => {
//   love.style.opacity = 1;
//   love.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";

//   setTimeout(() => {
//     love.style.opacity = 0;
//     love.style.transform = "translate(-50%, -300%) scale(0) rotate(-90deg)";
//   }, 600);
// });



img.addEventListener("dblclick", () => {
  love.style.opacity = 1;
  love.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";
  setTimeout(() => {
    love.style.transform = "translate(-50%, -400%) scale(1.2) rotate(60deg)";
  }, 800);
  setTimeout(() => {
    love.style.opacity=0;
  }, 1000);
  setTimeout(() => {
    love.style.transform = "translate(-50%, -50%) scale(0) rotate(0deg)";
  }, 1200);
});
