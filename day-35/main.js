// Level 2 – Slightly Tougher but Logical

// 11. Allow only 3 attempts to enter correct password
// If user gets it right early, stop. If not → “Account locked”

// let pass = "kuttakamina";

// let first = prompt("pehla password");
// if (first === pass) {
//   console.log("Done");
// } else {
//   let second = prompt("doosra password");
//   if (second === pass) {
//     console.log("Done");
//   } else {
//     let third = prompt("teesra password");
//     if (third === pass) {
//       console.log("Done");
//     } else {
//       console.error("Account Locked");
//     }
//   }
// }

// #####################

// let attempt = 0;
// let sahipassword = "harsh";
// let userpassword = prompt("Password batao");
// attempt++;

// while (sahipassword !== userpassword) {
//   if (attempt === 3) {
//     console.error("Too many attempts, Account Locked");
//     break;
//   }
//   userpassword = prompt("apna Password batao");
//   attempt++;
// }

// #####################

// let attempt = 0;
// let sahipassword = "harsh";
// let userpassword = prompt("Password batao");
// attempt++;

// while (attempt < 3 && sahipassword !== userpassword){
//  userpassword = prompt("Password batao");
//   attempt++;
// }

// if(attempt === 3 && sahipassword !== userpassword){
//     console.error("Account Locked")
// }else{
//     console.log("Password Match");

// }

// 12. Ask user for words until they type “stop”. Count how many times they typed “yes”
// Loop until "stop" is typed. Count "yes".

// let word = prompt("Say the word...")
// let yesCount = 0;
// while(word !== "stop"){
//     if(word === "yes"){
//         yesCount++;
//     }
//     word = prompt("Say the word...")
// }

// console.log(`Total times YES was said: ${yesCount}`);

// ===================================

// 13. Print numbers divisible by 7 from 1 to 50
// Use modulo % and loop.

// let count = 0;
// for (let i = 1; i < 51; i++) {
//   if (i % 7 === 0) {
//     console.log(i);
//   }
// }

// ===================================
// 14. Sum of all odd numbers from 1 to 30
// Add only odd numbers. Print final sum.

// let sum = 0;

// for (let i = 0; i < 31; i++) {
//   if (i % 2 !== 0) {
//     console.log(i);
//     sum += i;
//   }
// }

// console.log(sum);

// ===================================

// 15. Keep asking number until user enters an even number
// Use while loop. Stop only if input is even.


// let input = +prompt("Enter Even Number...");
// while (input % 2 !== 0) {
//   input = +prompt("Enter Even Number...");
// }
// console.log(`You have entered ${input}`);


// ===================================
// 16. Print numbers between two user inputs
// Input start and end using prompt() → print all between.

// let a = +prompt("Start");

// let b = +prompt("End");

// if(b>a && b!==a){
// for(i=a; i<=b; i++){
//     console.log(i);
    
// }

// }else{
//     console.log("Start can't be bigger then end!!")
// }

// ===================================

// 17. Print only first 3 odd numbers from 1 to 20
// Use loop. Stop with break after 3 odd prints.

// let counter = 0

// for(let i = 0; i<=20; i++){
//     if(counter===3){
//         break;
//     } 
//     if(i%2 !==0){
//         console.log(i);
//         counter++;
//     }
// }




// ===================================

