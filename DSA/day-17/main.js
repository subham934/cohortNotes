// let arr = [10,20,30,40,50]
// console.log(arr);
// arr.push(100)
// console.log(arr);
// arr.pop()
// console.log(arr);
// arr.unshift(69)
// console.log(arr);
// arr.shift()
// console.log(arr);
// console.log(arr[4]);
// console.log(arr.length);

// for(let i = 0; i<arr.length; i++){
//     console.log(arr[i]);
// }

// ============================

// let arr = new Array(2);
// console.log(arr.length);
// arr[0] = 10;
// arr[1] = 20;
// arr[2] = 30;
// arr[3] = 40;
// console.log(arr);
// console.log(arr.length);

// ============================

// let arr = new Array(3).fill(true);
// console.log(arr);
// arr[0] = 1;
// arr[1] = 5;
// console.log(arr);

// ============================

// let arr = [100, 'gru', true, {}]

// ============================

// let arr = new Array(3)
// arr.push(100);
// arr.unshift(1000);
// console.log(arr);

// ============================

// let prompt = require("prompt-sync")()
// let n = +prompt("Enter size of array")

// let arr = new Array(n)

// for(let i = 0; i<arr.length; i++){
//     arr[i] = prompt("Enter a value")
// }
// console.log(arr);

// ============================

// let arr = [10, 20, 30, 40, 50]

// let sum = 0;

// for(let i = 0; i<arr.length; i++){
//     sum = sum + arr[i];
// }

// console.log(sum);

// ============================

// let arr = [10, 20, 30, 40, 50, 34, 89, 321, 598, 5, 3, 48, 21, 13]

// let max = arr[0];
// for(let i=1; i<arr.length; i++ ){
//     if(arr[i]>max){
//         max = arr[i]
//     }
// }
// console.log(max);

// let min = arr[0];
// for(let i = 1; i<arr.length; i++){
//     if(arr[i]<min){
//         min = arr[i]
//     }
// }
// console.log(min);

// ============================
// second max element from array

// let arr = [10, 20, 30, 40, 50, 34, 89, 321, 598, 5, 3, 48, 21, 13];

// let max = Math.max(arr[0], arr[1]);
// let sMax = Math.min(arr[0], arr[1]);

// for (let i = 2; i < arr.length; i++) {
//   if (arr[i] > max) {
//     sMax = max;
//     max = arr[i];
//   } else if (arr[i] > sMax && arr[i] != max) {
//     sMax = arr[i];
//   }
// }

// console.log(sMax);

// ============================
// second min element from array

// let arr = [10, 20, 30, 40, 50, 34, 89, 321, 598, 5, 3, 48, 21, 13];

// let min = Math.min(arr[0], arr[1])
// let sMin = Math.max(arr[0], arr[1])

// for(let i = 2; i< arr.length; i++){
//     if(arr[i]<min){
//         sMin = min;
//         min = arr[i]
//     }else if(sMin>arr[i] && arr[i] !== min){
//         sMin = arr[i]
//     }
// }

// console.log(sMin);

// ============================
// Reverse the array

// let arr = [10, 20, 30, 40, 50, 34, 89, 321, 598, 5, 3, 48, 21, 13];

// let temp = new Array(arr.length);

// let i = arr.length - 1;
// for(let j = 0; j<temp.length; j++){
//     temp[j] = arr[i]
//     i--;
// }

// console.log(arr);
// console.log(temp);

// ===================================
// this takes extra space, lets do it without taking extra space

// let arr = [10, 20, 30, 40, 50, 34, 89, 321, 598, 5, 3, 48, 21, 13];
// let i = 0;
// let j = arr.length - 1;

// while (i < j) {
//   let temp = arr[i];
//   arr[i] = arr[j];
//   arr[j] = temp;
//   i++;
//   j--;
// }

// console.log(arr);

// ============================
// All zeros to left and all ones to right
// ============================

let arr = [0,0,1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0];

let j = 0;
let i = 0;
while (i < arr.length) {
  if (arr[i] == 0) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    console.log(arr);
    
    j++;
  }
  i++;
}

console.log(arr);

// ============================
// move all the element to the left and positive element to the right side
// ============================

// let arr = [1, -1, 44, -52, -23, -43, 98, 101, -328,-18, 12, 18]

// let i = 0;
// let j = 0;

// while(i < arr.length){
//     if(arr[i]<0){
//         let temp = arr[i]
//         arr[i] = arr[j]
//         arr[j] = temp
//         j++
//     }
//     i++
// }

// console.log(arr);

// let arr = [1,2,3,4,5]
// let n = arr.length;

// for(let i = 0; i<n-1; i++){
//     arr[i] = arr[i+1]
// }
// arr.length = n-1;

// console.log(arr);
