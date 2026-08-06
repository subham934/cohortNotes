// //
// # 🟡 Level 2 – Functional Thinking & Logic Tasks (Intermediate)

// 1. Write a higher-order function `runTwice(fn)` that takes another function and executes it two times.

// function runTwice(fn){
//     fn()
//     fn()
// }

// runTwice(function(){
//     console.log(`Hello`);
// })

// =========================
// 2. Create one pure function that always returns the same output for a given input, and one impure function using a global variable.

// function pure(a,b){
//     console.log(a+b);
// }
// pure(1,3)
// pure(1,3)

// let global = 0;
// function impure(a){
//     global++
//     console.log(a+global);

// }

// impure(2) //3
// impure(2) //4
// impure(2) //5

// =========================

// 3. Write a function that uses object destructuring inside parameters to extract and print `name` and `age`.

// function abcd({name, age}){
//     console.log(age);
//     console.log(name);
// }

// abcd({name: "subham",age: 32})

// =========================

// 4. Demonstrate the difference between normal function and arrow function when used as object methods (the `this` issue).

// console.log(this);
// let obj = {
//     name: 'harsh',
//     age: 27,
//     fnc: function(){
//         console.log(this);
//     },
//     fnc2 : ()=>{
//         console.log(this);
//         // arrow function apne this ki value parent se leta hai, yaha , fnc2 ak arrow function hai aur obj uska parent hai, since obj global space main likha hai aur global main this ki value window hoti hai, so iska result bhi window hi hoga
//     }

// }
// obj.fnc()
// obj.fnc2()

//  this keyword
// this ek aisa keyword hai jo ki dynamic hai iski value badal jaati hai
// ========================================================
// function outer() {
//   // outer function
//   let arrow = () => {
//     // arrow function — outer ke andar likha
//     console.log(this); // outer ka this lega!
//   };
//   arrow();
// }

// let obj = { name: "subham", outer };
// obj.outer();

// =========================

// 5. Given an array of numbers, use `map()` to create a new array where each number is squared.

// let arr = [1,2,3,4,5,6]

// let square = arr.map((elm)=>{
//     return elm**2;
// })

// console.log(square);

// =========================

// 6. Use `filter()` to get only even numbers from an array.

// let arr = [22, 23, 48, 45, 27, 88, 192, 548, 32, 11, 61, 285, 258, 30]

// let even_num = arr.filter((elem)=>{
//     return elem%2===0;
// })

// console.log(even_num);

// =========================

// 7. Use `reduce()` to find the total salary from an array of numbers `[1000, 2000, 3000]`.

// let salary = [1000, 2000, 3000];

// let total = salary.reduce((acc, val)=>{
//     return acc+val;
// },0)

// console.log(total);

// =========================

// 8. Create an array of names and use `some()` and `every()` to test a condition (e.g., all names longer than 3 chars).

// some() checks whether at least one element in an array satisfies a given condition. It returns a boolean (true or false) and stops early as soon as the condition becomes true.
// some() iterates over the array from left to right and calls the callback for each element. If the callback returns true for any element, some() immediately returns true and does not continue iterating. If no element passes the test, it returns false.

// const nums = [1, 3, 5, 8];

// const hasEven = nums.some(n => n % 2 === 0);
// console.log(hasEven); // true

// let names = ['avi', 'harsh', 'nishi', 'avinya', 'paul', 'sahil']

// let ans = names.some((val)=>{
//     return val === 'harsh'
// })

// console.log(ans);

// let names = ['avi', 'harsh', 'nishi', 'avinya', 'paul', 'sahil']

// let ans = names.some((val)=>{
//     return val.length > 3
// })

// console.log(ans); // true

// let names = ['avi', 'harsh', 'nishi', 'avinya', 'paul', 'sahil']

// let ans = names.every((val)=>{
//     return val.length > 3
// })

// console.log(ans); // false

// =========================

// 9. Create an object `user` and test the behavior of `Object.freeze()` and `Object.seal()` by adding/changing keys.

// let user = {
//     name : 'harsh',
//     age: 27,
//     email: 'harsh@harsh.com'
// }

// user.age = 37;
// console.log(user);

// // Object.freeze(user)
// // user.name = `harshita`;
// // console.log(user);

// Object.seal(user)
// user.name = `harshita`;
// console.log(user)

// freeze → na value badal sako ❌
//        → na naya property add karo ❌
//        → na property delete karo ❌

// seal → value badal sako ✅
//      → naya property add karo ❌
//      → property delete karo ❌
// =========================

// 10. Create a nested object (`user → address → city`) and access the city name inside it.

// const user = {
//   name: "Harsh",
//   age: 27,
//   address: {
//     city: "Delhi",
//     pincode: 110001
//   }
// };
// console.log(user.address.city);

// let obj = {
//   user: {
//     name: "harsh",
//     address: {
//       city: "Bhopal",
//     },
//   },
// };

// let { city } = obj.user.address;
// console.log(city); // Bhopal

// =========================
