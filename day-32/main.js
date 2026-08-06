// Loops and Conditional in JS

// console.log("Hello");

// let a = 12;

// if(a>10){
//     console.log("Bigger Number")
// }else{
//     console.log("smaller Number");
// }

// if("harsh"){
//     console.log("Bigger Number")
// }else{
//     console.log("smaller Number");
// }
// output: Bigger Number

// 0 "" false NaN null undefined docuement.all = convert to false
// baki kuch bhi true hai

// if(document.all){
//     console.log("Bigger Number")
// }else{
//     console.log("smaller Number");
// }
// output: smaller Number

// The ternary operator is just a shorter if-else.

// let age = 20;
// let canVote = age >= 18 ? "Yes, you can vote" : "No, you cannot vote";
// console.log(canVote);

// ✅ Basic switch Example

// let day = 3;

// switch (day) {
//   case 1:
//     console.log("Monday");
//     break;
//   case 2:
//     console.log("Tuesday");
//     break;
//   case 3:
//     console.log("Wednesday");
//     break;
//   default:
//     console.log("Invalid day");
// }

// Output: Wednesday

// ====================================

// let day = 8;

// switch (day) {
//   case 1:
//     console.log("Monday");
//     break;
//   case 2:
//     console.log("Tuesday");
//     break;
//   case 3:
//     console.log("Wednesday");
//     break;
//   case 4:
//     console.log("Thursday");
//     break;
//   case 5:
//     console.log("Friday");
//     break;
//   case 6:
//     console.log("Saturday");
//     break;
//   case 7:
//     console.log("Sunday");
//     break;
//   default:
//     console.log("Invalid day");
// }

// let fruit = "apple";

// switch (fruit) {
//   case "apple":
//     console.log("Apples are ₹120 per kg");
//     break;
//   case "banana":
//     console.log("Bananas are ₹40 per dozen");
//     break;
//   case "mango":
//     console.log("Mango is king of fruits 😋");
//     break;
//   default:
//     console.log("Unknown fruit");
// }

// Output: Apples are ₹120 per kg

// // ✅ Switch with Multiple Cases Doing the Same Thing

// let color = "red";

// switch (color) {
//   case "red":
//   case "maroon":
//     console.log("Warm color");
//     break;
//   case "blue":
//   case "cyan":
//     console.log("Cool color");
//     break;
//   default:
//     console.log("Unknown color type");
// }

// ✅ Switch Inside a Function

// function getGrade(score) {
//   switch (true) {
//     case score >= 90:
//       return "A";
//     case score >= 80:
//       return "B";
//     case score >= 70:
//       return "C";
//     default:
//       return "D";
//   }
// }

// console.log(getGrade(85)); // B

// ====================================================

// let score = 93;

// switch(true){
//     case score >= 90:
//         console.log("A, Excellent Student");
//         break;
//     case score >= 80:
//         console.log("B");
//         break;
//     case score >= 70:
//         console.log("C");
//         break;
//     default:
//         console.log("D, Very Bad Student");
// }

// ====================================================

// score = 81;
// switch (score) {
//   case score >= 90:
//     console.log("A");
//     break;
//   case score >= 80:
//     console.log("B");
//     break;
//   case score >= 70:
//     console.log("C");
//     break;
//   default:
//     console.log("D");
// }

// This code won’t work the way you expect ❌ because switch(score) only compares exact values, not conditions.

// let score = 81;

// switch (true) {
//   case score >= 90:
//     console.log("A");
//     break;
//   case score >= 80:
//     console.log("B");
//     break;
//   case score >= 70:
//     console.log("C");
//     break;
//   default:
//     console.log("D");
// }

// ============================

// for loop

// syntex
// for(start; end; change)

// for(let i = 1; i<6; i++){
//     console.log("subham");
// }

// for(let i = 30; i>9; i--){
//     console.log(i);
// }

// for(let i= 121; i>11; i--){
//     console.log(i);
// }

// for (let i = 12; i > 0; i--) {
//   if (i === 5 || i === 7) {

//   } else {
//     console.log(i);
//   }
// }

// for (let i = 12; i > 0; i--) {
//   if (i === 5 || i === 7) {
//     continue; // skip printing 5 and 7
//   }
//   console.log(i);
// }

// for (let i = 12; i > 0; i--) {
//     if(i !== 5 && i !==7){

//         console.log(i);
//     }

// }
