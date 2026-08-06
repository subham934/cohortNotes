// Multidimensional Array

// let prompt = require("prompt-sync")();

// let arr = new Array(3);

// for (let i = 0; i < arr.length; i++) {
//   arr[i] = new Array(2);
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     arr[i][j] = +prompt("Enter a value: ");
//   }
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     process.stdout.write(arr[i][j] + " ");
//   }
//   console.log();
// }

// =================================
// let count = 1;
// let arr = Array.from({length: 3}, ()=>  Array.from({length: 3}, ()=> count++));
// console.log(arr);

// =================================

// let arr = Array.from({length: 4}, ()=> new Array(3).fill(0))
// console.log(arr);

// =================================

// let arr1 = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

// =================================

// let arr2 = Array.from({length: 3}, ()=> new Array(3).fill(0))

// console.log(arr2); // [ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]

// =================================
// JACKED ARRAY
// =================================

// let arr4 = new Array(4)

// for(let i = 0; i<arr4.length; i++){
//     let dimension = Number(prompt("Enter Length of Inner Array: "))
//     arr4[i] = new Array(dimension)
// }

// for(let i=0; i<arr4.length; i++){
//     for(let j=0; j<arr4[i].length; j++){
//         arr4[i][j] = +prompt("Enter a value: ")
//     }
// }

// for(let i=0; i<arr4.length; i++){
//     for(let j=0; j<arr4[i].length; j++){
//         process.stdout.write(arr4[i][j]+" ")
//     }
//     console.log();
// }

// =================================

// let arr = new Array(2).fill(new Array(2).fill(0));
// arr[0][0] = 5;
// console.log(arr);

// =================================
// let prompt = require("prompt-sync")();

// let arr = new Array(4);

// for (let i = 0; i < arr.length; i++) {
//   let dimension = Number(prompt("Enter Length of Inner Array: "));
//   arr[i] = new Array(dimension);
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     arr[i][j] = Number(prompt("Enter a Value: "));
//   }
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     process.stdout.write(arr[i][j] + " ");
//   }
//   console.log();
// }
