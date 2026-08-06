// while loop

// let i = 1;
// while(i<=10){
//     console.log(i);
//     i++;
// }

// in for loop, number of iteration is known, but in while, number of iteration is unknown

// REVERSE A NUMBER ===============
// let n = 5898;
// let rev = 0;

// while (n > 0) {
//   let rem = n % 10;
//   rev = ( rev * 10) + rem;
//   n = Math.floor(n  / 10);
// }
// console.log(rev);

// ================================

// let prompt = require("prompt-sync")();
// let n = Number(prompt("Enter a Number: "))
// let rev = 0;

// while(n>0){
//     rev = (rev*10) + (n%10)
//     n = Math.floor(n/10);
// }

// console.log(rev);

// ================================

// function sumOfDigits(n) {
//     // Write your logic here
//     let sum = 0;
//     while(n>0){
//         sum += n%10;
//         n = Math.floor(n/10)
//     }
//     console.log(sum);

// }

// sumOfDigits(12)

// ================================

// function isAutomorphic(n) {
//   // Write your logic here
//   let square = n ** 2;

//   while (n > 0) {
//     if (n % 10 !== square % 10) {
//       console.log("No");
//       return;
//     }
//     n = Math.floor(n / 10);
//     square = Math.floor(square / 10);
//   }
//   console.log("Yes");
// }

// isAutomorphic(25);

// ================================

