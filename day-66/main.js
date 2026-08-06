// var arr = [10, 20, 30, 40]
// // let arr2 = arr;
// arr2 = [...arr]
// arr2[0] = 24;
// console.log(arr);
// console.log(arr2);

// let obj1 = {
//     name: 'Sujoy',
//     age: 23,
// }
// let obj2 = obj1;
// let obj2 = {...obj1};
// obj2.name = 'rana'
// console.log(obj1, obj2);

// =================================================

let obj1 = {
  name: "harsh",
  age: 27,
};

let obj2 = {
  name: "sarthak",
  work: "fullstack dev",
};

let obj3 = { ...obj1, ...obj2 };
console.log(obj3);

import user from "./script.js";
console.log(user);

import king from "./script.js"; // if its a default export , we can inport with any name
console.log(king);

import { skills, numbers, pinku  } from "./script.js";
console.log(skills);
console.log(numbers);
console.log(pinku);
