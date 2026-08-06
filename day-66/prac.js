// var arr = [1,3,2,5,5]
// let arr2 = [...arr]
// arr2[3] = 23;
// console.log(arr);
// console.log(arr2);

// let obj = {
//     name: "Raja",
//     age: 23,

// }

// let obj1 = {...obj};
// obj1.age = 24;
// console.log(obj);
// console.log(obj1);

// let obj1 = {
//     name: "Rakesh",
//     age: 23,
// }

// let obj2 = {
//     name: "Suresh",
//     work : "Full Stack Devloper",
// }

// let obj3 = {...obj1, ...obj2}
// console.log(obj3);

// import rakh from './script.js'
// console.log(rakh);

// import king from "./script.js"; // if its a default export , we can inport with any name
// console.log(king);

// import { skills, numbers, pinku }  from "./script.js";
// console.log(skills);
// console.log(numbers);
// console.log(pinku);

// =================================================
// const arr = [10,20,30]
// const [a,b,x] = arr;
// console.log(a,b,x);

// =================================================
// const arr = [ 12, 239, 89, 82, 19, 39, 27]

// const [first, , second, , ,third] = arr;
// console.log(first);
// console.log(second);
// console.log(third);

// =================================================

// const arr = [10]
// const [a, b = 23] = arr;
// console.log(a);
// console.log(b);

// =================================================

// const user = {
//   name: "Anubhav",
//   age: 24,
//   role: "Developer"
// };

// const { name,role, age } = user;

// console.log(name); // Anubhav
// console.log(age);  // 24
// console.log(role);

// =================================================

// const obj = {
//     name: "Rakesh",
//     age: 23,
//     work : "Full Stack Devloper",
// }

// const {name: username, age: realAge, work: role} = obj ;

// console.log(username);
// console.log(realAge);
// console.log(role);

// =================================================

// const obj = {
//     name: "Rakesh",
//     age: 23,
//     work : "Full Stack Devloper",
// }

// const {name, age , work} = obj;

// console.log(name);
// console.log(age);
// console.log(work);

// =================================================

// const user = { name: "Anubhav" };

// const { name, city = "Delhi" } = user;

// console.log(city); // Delhi

// const {work = "Hot Shot Attorney"} = user;
// console.log(user);

// let a = 'asldkapo'
// console.log(a.split(""));

// =================================================

// let l1 = [1,2,3]
// let l2 = [4,5,6]

// console.log(typeof l1.reverse().join(""));

// =================================================
// const user = {
//   name: "Anubhav",
//   address: {
//     city: "Patna",
//     pincode: 800001,
//   },
// };

// const { name } = user;
// console.log(name);

// const { address } = user;
// console.log(address); // { city: 'Patna', pincode: 800001 }

// const { city } = address;
// console.log(city); // Patna

// const {
//   address: { city }
// } = user;
// console.log(city); // Patna

// =================================================
// const numbers = [2, 3, 4];

// const updated = [1, ...numbers, 5];

// console.log(updated);

// =================================================


// const user = { name: "Anubhav", age: 24, "last name": "Kumar" };

// const copy = { ...user };
// copy["last name"] = "biswas"

// console.log(copy.name);
// console.log(copy["name"]);
// console.log(copy["last name"]);


// =================================================


// const obj1 = { a: 1 };
// const obj2 = { b: 2 };

// const merged = { ...obj1, ...obj2 };

// console.log(merged);

// =================================================

// const user = { name: "Anubhav", age: 24 };

// const updatedUser = { ...user, age: 25 };

// console.log(updatedUser);


// =================================================

// const [first, ...rest] = [10, 20, 30, 40];

// console.log(first); // 10
// console.log(rest);  // [20,30,40]


// const user = {
//   name: "Anubhav",
//   age: 24,
//   role: "Developer"
// };

// const { name, ...others } = user;

// console.log(name);   // Anubhav
// console.log(others); // { age: 24, role: "Developer" }


// =================================================

function sum(...elems){
    return elems.reduce((acc, val)=> acc+val, 0)
}
console.log(sum(1,2,3));


// =================================================
// =================================================
// =================================================
// =================================================
// =================================================
