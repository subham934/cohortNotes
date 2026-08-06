// ISBN Number- ISBN (International Standard Book Number) is a 10-digit or 13-digit number used to uniquely identify books.

// ISBN: 0306406152
// 1×0 + 2×3 + 3×0 + 4×6 + 5×4 + 6×0 + 7×6 + 8×1 + 9×5 + 10×2 = 165

// 165 % 11 = 0 → VALID ISBN

// =====================================
// ===================== counting number of digits in a number ========================
// =====================================

// let n = 89715;
// let count = 0;

// while(n>0){
//     count++;
//     n = Math.floor(n/10);
// }

// console.log(count);

// =====================================

// let prompt = require("prompt-sync")();
// let n = prompt("Enter a Number: ");

// let copy = n;
// let count = 0;
// // "0306406152";
// while (n > 0) {
//   count++;
//   n = Math.floor(n / 10);
// }

// if (count != 10) {
//   console.log("Invalid ISBN");
// } else {
//   let ans = 0;
//   while (copy > 0) {
//     let dig = copy % 10;
//     ans = ans + dig * count;
//     count--;
//     copy = Math.floor(copy / 10);
//   }
//   console.log(ans % 11 == 0 ? "Valid ISBN" : "Invalid ISBN");
// }

// this is valid for isbn number that dont start with 0 and is 10 digit

// =====================================
// Automorphic Number
// =====================================


// let prompt = require("prompt-sync")();
// let n = prompt("Enter a Number: ");

// let copy = n;
// let count = 0;
// let sq = n * n;
// while (n > 0) {
//   count++;
//   n = Math.floor(n / 10);
// }

// if (sq % Math.pow(10, count) == copy) {
//   console.log("Automorphic Number");
// } else {
//   console.log("Not an Automorphic Number");
// }

// function reserveNumber(n){
//     let rev = 0

//     while(n>0){
//         let rem = n % 10;
//         let rev = (rev * 10) + rem;
//         n = Math.floor(n/10);
//     }
//     return rev;
// }

// ===============================



