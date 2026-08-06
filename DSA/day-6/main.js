// What is switch?

// switch is just another way to write many if–else checks
// but only for ONE value.

// Think of it as:

// “If this value is this, do something.
// If it’s that, do something else.”

// let prompt = require("prompt-sync")();
// let day = +prompt('Enter day')

// switch(day){
//     case 1: {
//         console.log('monday');
//         break;
//     }
//     case 2: {
//         console.log('tuesday');
//         break;
//     }
//     case 3: {
//         console.log('wednessday');
//         break;
//     }
//     case 4: {
//         console.log('thursday');
//         break;
//     }
//     case 5: {
//         console.log('friday');
//         break;
//     }
//     case 6: {
//         console.log('saturday');
//         break;
//     }
//     case 7: {
//         console.log('sunday');
//         break;
//     }
//     default: {
//         console.log('Invalid');

//     }
// }

// let marks = Number(prompt("Enter marks"));

// switch (true) {
//   case marks >= 90 && marks <= 100:
//     console.log("Grade A");
//     break;

//   case marks >= 80 && marks < 90:
//     console.log("Grade B");
//     break;

//   case marks >= 70 && marks < 80:
//     console.log("Grade C");
//     break;

//   case marks >= 60 && marks < 70:
//     console.log("Grade D");
//     break;

//   case marks >= 0 && marks < 60:
//     console.log("Fail");
//     break;

//   default:
//     console.log("Invalid marks");
// }

// ==================================



// let prompt = require("prompt-sync")();

// let consonent = 0;
// let vowel = 0;

// let s = prompt("Enter a string: ");

// for (let i = 0; i < s.length; i++) {
//   let ch = s.charAt(i);
//   switch (ch) {
//     case "a":
//     case "e":
//     case "i":
//     case "o":
//     case "u":
//       vowel++;
//       break;

//     default:
//       consonent++;
//   }
// }

// console.log("Consonent: ", consonent);
// console.log("Vowel: ", vowel);


// ==========================

// write a program to calculate the area of a circle, rectangle, triangle using a switch statement

// let prompt = require("prompt-sync")();

// console.log("Enter 1 for area of ractangle");
// console.log("Enter 2 for area of circle");
// console.log("Enter 3 for area of triangle");


// let n = +prompt('Enter value: ')

// switch(n){
//     case 1: {
//         let len = Number(prompt("Enter Length"))
//         let breadth = Number(prompt("Enter breadth"))

//         console.log(len*breadth);
//         break;
        
//     }
//     case 2: {
//         let rad = Number(prompt("Enter Radius of Circle"));
//         console.log((Math.PI*rad*rad).toFixed(2));
//         break;
//     }
//     case 3: {
//         let height = Number(prompt("Enter height"));
//         let base = Number(prompt("Enter base"));
//         console.log(0.5*height*base);
//         break;
//     }

//     default:
//         console.log("Ivalid Number");
        
// }


