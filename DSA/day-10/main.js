// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter Number: "));
// let count = 0;

// for (let i = 1; i <= n; i++) {
//   if (n % i == 0) {
//     count++;
//   }
// }

// if (count == 2) {
//   console.log("Prime Number");
// } else {
//   console.log("Not a Prime Number");
// }

// lets shorten the previous code==========================

// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter Number: "));
// let count = 0;

// if (n <= 1) {
//   console.log("Not Prime");
// } else {
//   for (let i = 2; i <= n / 2; i++) {
//     if (n % i == 0) {
//       count++;
//     }
//   }

//   if (count == 0) {
//     console.log("Prime Number");
//   } else {
//     console.log("Not a Prime Number");
//   }
// }

// =====================================

// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter Number: "));
// let count = 0;

// if (n <= 1) {
//   console.log("Not Prime");
// } else {
//   for (let i = 2; i <= Math.sqrt(n); i++) {
//     if (n % i == 0) {
//       count++;
//     }
//   }

//   if (count == 0) {
//     console.log("Prime Number");
//   } else {
//     console.log("Not a Prime Number");
//   }
// }

// =====================================

// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter Number: "));

// if (n === 2) {
//   console.log("Prime");
//   return;
// }
// if (n <= 1 || n % 2 === 0) {
//   console.log("Not Prime");
//   return;
// }

// for (let i = 3; i <= Math.sqrt(n); i += 2) {
//   if (n % i === 0) {
//     console.log("Not Prime");
//     return;
//   }
// }

// console.log("Prime");

// =====================================

// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter Number: "));

// if (n <= 1) {
//   console.log("Not Prime");
// } else if (n == 2) {
//   console.log("Prime");
// } else if (n % 2 == 0) {
//   console.log("Not Prime");
// } else {
//   let isPrime = true;
//   for (let i = 3 ; i <= Math.floor(Math.sqrt(n)); i += 2) {
//     if (n % i == 0) {
//       isPrime = false;
//       break;
//     }
//   }
//   console.log(isPrime ? "Prime" : "Not Prime");
// }


// =================================


// let n = 123;
// let digits = n.toString().split('')

// let num = digits.map((elem)=>{
//     return Number(elem)
// })
// let sum = 0
// num.forEach((data)=>{
//     let fact = 1
//     for(let i = 1; i<=data; i++){
//         fact *= i
//     }
//     sum += fact
// })
// console.log(sum);


// let i = 0;
// while(++i<5){
//     console.log(i);
    
// }


let n = 125;




