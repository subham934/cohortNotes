// DOM - Document Object Model

var h1 = document.querySelector("h1");

// h1.addEventListener("click", () => {
//   h1.innerHTML = "Bye";

//   h1.style.color = "red";
//   h1.style.backgroundColor = "pink";
// });

// Math.random() is a method

// let a = Math.round(Math.random()*100)
// console.log(a);

// console.log(Math.round(83.87232));
// console.log(Math.round(83.17232));

let btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
  var arr = ["vedant", "abhi", "rana", "sumit", "ankit", "satwik", "sarthak"];

  var a = Math.floor(Math.random() * arr.length);

  // capitalize first letter
  var name = arr[a];
  name = name[0].toUpperCase() + name.slice(1);    
  h1.innerHTML = name;

});
