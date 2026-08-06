// do while loop
// Its an exit control loop , it does the task once without any condition

// let i = 1;
// do{
//     console.log("Hello World", i);
//     i++;
// }while(i<=5);

// ==========================

// let prompt = require('prompt-sync')()
// let n;

// do{
//     console.log("Hello World");
//     n = +prompt("Enter a Number: ");

// }while(n==1);

// ==========================

// let prompt = require("prompt-sync")();
// let computer = Math.floor(Math.random() * 100 + 1);

// let user;
// let attempt = 0;
// do {
//   attempt++;
//   user = Number(prompt("Enter a Number between 1 to 100:"));
//   if (user > computer) {
//     console.log("Too Large");
//   } else if (user < computer) {
//     console.log("Too Small");
//   } else if (user == computer) {
//     console.log(
//       `Congratulations , you guessed the number correctly! The number was ${computer} and you took ${attempt} to answer`
//     );
//   } else {
//     console.log("Invalid Number");
//   }
// } while (user != computer);

// ==========================
// let prompt = require("prompt-sync")();

// do {
//   console.log("Enter 1 for addition: ");
//   console.log("Enter 2 for subtraction: ");
//   console.log("Enter 3 for division: ");
//   n = +prompt("Enter a Number: ");
//   switch (n) {
//     case 1: {
//       let a = +prompt("Enter First Number: ");
//       let b = +prompt("Enter Second Number: ");

//       console.log(`Addition: ${a + b}`);
//       break;
//     }
//     case 2: {
//       let a = +prompt("Enter First Number: ");
//       let b = +prompt("Enter Second Number: ");

//       console.log(`Subtraction: ${a - b}`);
//       break;
//     }
//     case 3: {
//       let a = +prompt("Enter First Number: ");
//       let b = +prompt("Enter Second Number: ");

//       console.log(`Division: ${a / b}`);
//       break;
//     }

//     default: {
//       console.log("Invalid Number");
//     }
//   }

//   n = +prompt("Enter 10 for recontinue program");
// } while (n == 10);

//================================================

// const prompt = require("prompt-sync")();
// let n;

// do {
//   console.log("\nEnter 1 for Italian Food");
//   console.log("Enter 2 for Japanese Food");
//   console.log("Enter 3 for Indian Food");
//   console.log("Enter 4 for American Food");

//   n = +prompt("Enter your favorite cuisine number you wish to eat: ");

//   switch (n) {
//     // 🇮🇹 ITALIAN
//     case 1: {
//       console.log("\nEnter 1 for Pizza Margherita");
//       console.log("Enter 2 for Pasta Carbonara");
//       console.log("Enter 3 for Risotto alla Milanese");
//       console.log("Enter 4 for Lasagna");

//       let a = +prompt("Enter Your Favorite dish Number: ");

//       switch (a) {
//         case 1:
//           console.log("Here is your Pizza Margherita 🍕, Enjoy your Meal!!");
//           break;
//         case 2:
//           console.log("Here is your Pasta Carbonara 🍝, Enjoy your Meal!!");
//           break;
//         case 3:
//           console.log(
//             "Here is your Risotto alla Milanese 🍚, Enjoy your Meal!!",
//           );
//           break;
//         case 4:
//           console.log("Here is your Lasagna 🧀, Enjoy your Meal!!");
//           break;
//         default:
//           console.log("Invalid Italian dish choice");
//       }
//       break;
//     }

//     // JAPANESE
//     case 2: {
//       console.log("\nEnter 1 for Sushi");
//       console.log("Enter 2 for Ramen");
//       console.log("Enter 3 for Tempura");
//       console.log("Enter 4 for Okonomiyaki");

//       let a = +prompt("Enter Your Favorite dish Number: ");

//       switch (a) {
//         case 1:
//           console.log("Here is your Sushi 🍣, Enjoy your Meal!!");
//           break;
//         case 2:
//           console.log("Here is your Ramen 🍜, Enjoy your Meal!!");
//           break;
//         case 3:
//           console.log("Here is your Tempura 🍤, Enjoy your Meal!!");
//           break;
//         case 4:
//           console.log("Here is your Okonomiyaki 🥞, Enjoy your Meal!!");
//           break;
//         default:
//           console.log("Invalid Japanese dish choice");
//       }
//       break;
//     }

//     // 🇮🇳 INDIAN
//     case 3: {
//       console.log("\nEnter 1 for Butter Chicken");
//       console.log("Enter 2 for Biryani");
//       console.log("Enter 3 for Paneer Tikka");
//       console.log("Enter 4 for Masala Dosa");

//       let a = +prompt("Enter Your Favorite dish Number: ");

//       switch (a) {
//         case 1:
//           console.log("Here is your Butter Chicken 🍛, Enjoy your Meal!!");
//           break;
//         case 2:
//           console.log("Here is your Biryani 🍚, Enjoy your Meal!!");
//           break;
//         case 3:
//           console.log("Here is your Paneer Tikka 🧀, Enjoy your Meal!!");
//           break;
//         case 4:
//           console.log("Here is your Masala Dosa 🥞, Enjoy your Meal!!");
//           break;
//         default:
//           console.log("Invalid Indian dish choice");
//       }
//       break;
//     }

//     // 🇺🇸 AMERICAN
//     case 4: {
//       console.log("\nEnter 1 for Cheeseburger");
//       console.log("Enter 2 for Fried Chicken");
//       console.log("Enter 3 for Mac and Cheese");
//       console.log("Enter 4 for BBQ Ribs");

//       let a = +prompt("Enter Your Favorite dish Number: ");

//       switch (a) {
//         case 1:
//           console.log("Here is your Cheeseburger 🍔, Enjoy your Meal!!");
//           break;
//         case 2:
//           console.log("Here is your Fried Chicken 🍗, Enjoy your Meal!!");
//           break;
//         case 3:
//           console.log("Here is your Mac and Cheese 🧀, Enjoy your Meal!!");
//           break;
//         case 4:
//           console.log("Here is your BBQ Ribs 🍖, Enjoy your Meal!!");
//           break;
//         default:
//           console.log("Invalid American dish choice");
//       }
//       break;
//     }

//     default:
//       console.log("Invalid cuisine choice");
//   }

//   n = +prompt("\nEnter 10 to continue ordering, any other number to exit: ");
// } while (n === 10);

// ===============================

// function is_abundant(nStr) {
//   // Write your code here
//   let sum = 0;
//   let i = 1;
//   while (i <= nStr / 2) {
//     if (nStr % i == 0) {
//       sum += i;
//     }
//     i++;
//   }

//   if (sum > nStr) {
//     console.log("Abundant");
//   } else {
//     console.log("Not Abundent");
//   }
// }

// is_abundant(12);

// ===============================

// function prime_factors(nStr) {
//   let i = 2;
//   while (i * i <= nStr) {
//     while (nStr % i == 0) {
//       console.log(i);
//       nStr = nStr / i;
//     }
//     i++;
//   }
//   if (nStr > 1) console.log(nStr);
// }

// prime_factors(30);
// prime_factors(12);
// prime_factors(24);
// prime_factors(64);
// ===============================

// nStr = 23153;

// let count = 0;
// while (nStr > 0) {
//   nStr = Math.floor(nStr / 10);
//   count++;
// }

// console.log(count);

// function prime_factors(nStr) {
//   // Write your code here
//   if (nStr == 0 || nStr == 1) {
//     console.log("No prime factors");
//     return;
//   }

//   let i = 2;
//   while (i * i <= nStr) {
//     while (nStr % i == 0) {
//       console.log(i);
//       nStr = nStr / i;
//     }
//     i++;
//   }
//   if (nStr > 1) {
//     console.log(nStr);
//   }
// }

// prime_factors(28)



let a = String.fromCharCode(68)
let b = "C".charCodeAt(0)
console.log(a,b);

