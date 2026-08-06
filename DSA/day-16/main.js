// Strong NUmber================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");
// let ans = 0;
// let copy = n;

// while (n > 0) {
//   let dig = n % 10;
//   let fact = 1;
//   for (let i = 1; i <= dig; i++) {
//     fact = fact * i;
//   }
//   ans += fact;
//   n = Math.floor(n / 10);
// }

// if (copy == ans) {
//   console.log("Strong Number");
// } else {
//   console.log("Not Strong Number");
// }

// =================================

// let prompt = require("prompt-sync")()
// let n = +prompt("Enter a Number: ")

// for (let i = 1; i<=n ; i++){
//     process.stdout.write("⭐");
// }

// =================================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= n; j++) {
//     process.stdout.write("⭐");
// }
// console.log("");
// }

// outer loop is for row, inner loop is for column

// =================================
// RIGHT ANGLE TRIANGLE
// =================================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= i; j++) {
//     process.stdout.write("⭐");
// }
// console.log("");
// }

// =================================
// INVERTED RIGHT ANGLE TRIANGLE
// =================================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= n-i+1; j++) {
//     process.stdout.write("⭐");
// }
// console.log("");
// }

// -----------------------------

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for (let i = n; i >= 1; i--) {
//   for (let j = 1; j <= i; j++) {
//     process.stdout.write("⭐ ");
//   }
//   console.log("");
// }

// -----------------------------

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for (let i = 1; i <= n; i++) {
//     for (let j = n; j >=i; j--) {
//         process.stdout.write("⭐");
//     }
//     console.log("");
// }

// =================================
// MIRROR RIGHT ANGLE TRIANGLE
// =================================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// // inverted
// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= n-i; j++) {
//     process.stdout.write("  ");
// }

// // right angle triangle
// for (let j = 1; j <= i; j++) {
//     process.stdout.write("* ");
// }
// console.log("");
// }

// =================================
// MIRROR RIGHT ANGLE TRIANGLE INVERSE
// =================================

// let prompt = require('prompt-sync')()
// let n = +prompt("Enter a Number: ")

// for(let i = n; i>=1 ; i--){
//     for (let j = 1; j <= n-i; j++) {
//         process.stdout.write("  ");
//     }
//     for(let j = 1; j<= i; j++){
//         process.stdout.write("* ")
//     }

//     console.log("");

// }

// =================================
// TRIANGLE PATTERN
// =================================

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// // inverted
// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= n-i; j++) {
//     process.stdout.write(" ");
// }

// // right angle triangle
// for (let j = 1; j <= i; j++) {
//     process.stdout.write("* ");
// }
// console.log("");
// }

// =================================
// CROSS PATTERN - Only happens with Odd Number i

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");

// for(let i = 1; i<= n; i++){
//     for(let j=1; j<=n;j++){
//         if((i==j) || (i+j == n+1)){
//             process.stdout.write("*")
//         }else{
//             process.stdout.write(" ")
//         }

//     }
//     console.log('');

// }

// =================================
// V PATTERN

// let prompt = require("prompt-sync")();
// let n = +prompt("Enter a Number: ");
 
// for (let i = 1; i <= n; i++) {
//   for (let j = 1; j <= n; j++) {
//     if (i == j) {
//       process.stdout.write("*");
//     } else {
//       process.stdout.write(" ");
//     }
//   }

//   for (let j = n-1; j >= 1; j--) {
//     if (i == j) {
//       if(j !=n ){
//         process.stdout.write("*");
//       }else{
//         process.stdout.write(" ");
//       }
//     } else {
//       process.stdout.write(" ");
//     }
//   }

//   console.log("");
// }

// =================================


