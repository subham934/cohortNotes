// let para = document.querySelector("p");
// const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// const text = para.innerText;

// let iteration = 0;

// function randomText(){
//     const str = text.split('').map((char, index)=>{
//         if(index<iteration){
//             return char;
//         }

//         return characters.split('')[Math.floor(Math.random()*52)]
//     }).join('')

//     para.innerText = str;

//     iteration += 0.2;
// }

// setInterval(randomText, 30);


// ======================================================================



// let para = document.querySelector("p");
// const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// const text = para.innerText;
// let iteration = 0;

// para.addEventListener("mouseenter", function () {
//   setInterval(() => {
//     const str = text
//     .split("")
//     .map((char, index) => {
//       if (index < iteration) {
//         return char;
//         } else {
//           return characters.split("")[Math.floor(Math.random() * 52)];
//         }
//       })
//       .join("");

//     para.innerText = str;

//     iteration += 0.2;
//   }, 30);
// });

// ======================================================================


let para = document.querySelector("p");

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const text = para.innerText;

let interval = null;

para.addEventListener("mouseenter", () => {
  let iteration = 0;

  clearInterval(interval); // 🧠 old interval band karo

  interval = setInterval(() => {
    const str = text
      .split("")
      .map((char, index) => {
        if (index < Math.floor(iteration)) {
          return char; // original character
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");

    para.innerText = str;

    iteration += 0.2;

    // ✅ stop when complete
    if (iteration >= text.length) {
      clearInterval(interval);
      para.innerText = text; // final clean text
    }
  }, 30);
});