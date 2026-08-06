// 7. Ask user’s age and check if eligible to vote
// If age >= 18 → “Eligible”, else → “Not eligible”

// let age = +prompt('What is you age?')

// let voteAge = (age>=18)?"Can Vote": "Can't Vote";
// console.log(voteAge);

// ############################

// let age = prompt("What is you age?");

// if (age === null) {
//   console.error("You cancelled...");
// } else if (age.trim() === "") {
//   console.warn("Please write Somthing");
// } else if (isNaN(age.trim())) {
//   console.log("Please Enter a Valid Age");
// } else {
//   if (age >= 18 && age < 99) {
//     console.log(`Your age is ${age} and you can vote`);
//   } else if (age > 99) {
//     console.log(`You are too old, you should have been dead`);
//   } else if (age < 0) {
//     console.log("Invalid age");
//   } else {
//     console.log(`Your age is below 18 and you can't vote`);
//   }
// }

// ====================================

// 8. Print multiplication table of 5
// Use loop to print 5 × 1 to 5 × 10.

// for (let i = 1; i < 11; i++) {
//   console.log(`5 x ${i} = ${5 * i}`);
// }

// ====================================

// 9. Count how many numbers between 1 and 15 are greater than 8
//  Loop and count conditionally.

// var count = 0;
// for (let i = 1; i < 16; i++) {
//   if (i > 8) {
//     ++count;
//   }
// }
// console.log(count);

// ====================================

// 10. Ask user for password and print access status
// Hardcoded correct password. Compare with user input.

// let password = "RAJAB@b0"

// let askPass = prompt("Please write your password")

// if(askPass === null){
//     console.error("You Cancelled..")
// }else{
//     if(askPass === password){
//         console.log("Password Matched");

//     }else{
//         console.error("Wrong Password")
//     }
// }

// ====================================
// LEVEL-2 Slightly Tougher but Logical
// ====================================

// 11. Allow only 3 attempts to enter correct password
// If user gets it right early, stop. If not → “Account locked”
// ##########################

// let password = "RAJAB@b0";
// let attempts = 0;

// while (attempts < 3) {
//   let pass = prompt("Enter Password: ");

//   if (pass === null) {
//     console.error("You Cancelled..");
//     break;
//   }

//   if (pass === password) {
//     console.log("Password Matched");
//     break;
//   } else {
//     console.error("Wrong Password");
//   }

//   attempts++;
// }

// if (attempts === 3) {
//   console.log("Too Many Attempts, account locked");
// }

// ##########################

// let attempts = 0;
// let khulgaya = false;
// let pass = "harshbhai";

// let password = prompt("Password Batao");
// attempts++;

// if (password === pass) {
//   khulgaya = true;
// }

// while (password !== pass) {
//   if (attempts === 3) {
//     console.error("Account Locked");
//     break;
//   }

//   password = prompt("password batao");
//   if (password === pass) {
//     khulgaya = true;
//   }

//   attempts++;
// }

// if(khulgaya === true) console.log("account opened");

