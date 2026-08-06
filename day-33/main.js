// 1. Print numbers from 1 to 10

// for(let i = 1; i<=10; i++){
//     console.log(i);

// }

// =============================
// 2. Print only even numbers from 1 to 20.

// for (let i = 1; i < 21; i++) {
//   if (i % 2 === 0) {
//     console.log(i);
//   }
// }

// for (let i = 2; i < 21; i += 2) {
//   console.log(i);
// }

// =============================

//  3. Print number 10 to 1

// for (let i = 10; i > 0; i--) {
//   console.log(i);
// }

// =============================

// 4. Print the word "yes" 5 times , repeat using loop

// for(let i = 1; i<= 5; i++){
//     document.write('yes <br>');
// }

// =============================

// 5. print whether the numbers from 1 to 10 are even or odd

// for (let i = 1; i < 11; i++) {
//   i % 2 === 0 ? console.log("Even", i) : console.log("Odd", i);
// }

// =============================
// 6. Ask user for a number and say if its positive or negative

// jab bhi prompt se kuch mangoge to socho kya wo number hai, aur agar hai, toh convert karna padega

// parseInt
// Number
// +prompt("")

// let num = prompt("Number batao");
// num = Number(num);

// let isNum = num > 0 ? "Positive Number" : "Negative Number";

// console.log(isNum);

// =============================

// 7. Ask user's age and check if he is eligible to vote or not

// let age = +prompt("Number batao");
// let isVote = age > 18 ? "Can Vote" : "Can't Vote";
// console.log(isVote);

// let age = prompt("age batao");

// if (age === null) {
//   console.error("You pressed cancel");
// } else if (age.trim() === "") {
//   console.log("bhai dhang se likh le");
// } else if (!isNaN(age)) {
//   age = Number(age.trim());
//   console.log("Your age is:", age);
// } else {
//   console.log("please enter a valid number");
// }
// #####################

// let age = prompt("age batao");

// if (age === null) {
//   console.error("You pressed cancel");
// } else {
//   if (age.trim() === "") {
//     console.warn("bhai dhang se likh le....");
//   } else {
//     age = Number(age.trim());
//     if (isNaN(age)) {
//       console.error("bhai please number dede...");
//     } else {
//       console.log(`the age is ${age}`  );
//     }
//   }
// }



// =============================



// 8. Print multiplication table of 5
// Use loop to print 5 × 1 to 5 × 10.


// for(let i = 1; i<=10; i++){
//     console.log(`5 x ${i} = ${5*i}`);
// }