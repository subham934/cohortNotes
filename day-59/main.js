// Introduction to async JS

// js - single threaded
// ek kaam ek baar main kar payegi

// Intro to Callback and problems in callbacks

// callback = ek function , jo turant nahi chalega, ye chalega jab aapka koi kaam complete hoga.

// setTimeout(() => {
//     console.log("hey");
// }, 1000);

// getDataFromInstagram('ayush123', function(){})

// In programming, a callback function is simply a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.

// 1️⃣ Callback with a Simple Function Execution

// function greet(name, callback) {
//   console.log("Hello " + name);
//   callback();
// }

// function sayBye() {
//   console.log("Goodbye!");
// }

// greet("Subham", sayBye);

// What’s happening
// sayBye is passed as a callback
// It runs after greet finishes its main task
// ===================================
// 2️⃣ Callback with Array forEach()

// const numbers = [1, 2, 3, 4];

// numbers.forEach(function (num) {
//   console.log(num * 2);
// });

// What’s happening
// The function inside forEach is a callback
// JavaScript calls it for each element in the array
// ===================================
// 3️⃣ Callback with Array map()

// const prices = [100, 200, 300];

// const discountedPrices = prices.map(function (price) {
//   return price - 50;
// });

// console.log(discountedPrices);

// What’s happening
// The function passed to map is a callback
// It runs once for every array item and returns a new array

// ===================================

// 4️⃣ Callback in Event Handling (Button Click)

// const button = document.querySelector("button");
// button.addEventListener("click", function () {
//   console.log("Button clicked!");
// });

// What’s happening
// The function is a callback
// It runs only when the click event happens

// ===================================

// 5️⃣ Callback for Custom Logic (Success / Failure)

// function calculate(a, b, operation) {
//   return operation(a, b);
// }

// function add(x, y) {
//   return x + y;
// }

// function multiply(x, y) {
//   return x * y;
// }

// console.log(calculate(5, 3, add));       // 8
// console.log(calculate(5, 3, multiply));  // 15

// What’s happening

// add and multiply are callbacks
// They decide how calculate works

// ===================================

// function abcd(fn){
//     fn()
// }

// abcd(function (){
//     console.log('hey');
// })

// ===================================

// function abcd(fn){
//     fn(function(fn2){
//         fn2(function(){
//             console.log("Ola Amigo");
//         })
//     })
// }

// abcd(function (fn){
//     // console.log("Hi Gabrial");
//     fn(function(fn3){
//         fn3()
//     })
// })

// ===================================

// function abc(fn) {
//   fn(function (fn3) {
//     fn3(function (fn5) {
//       fn5();
//     });
//   });
// }

// abc(function (fn2) {
//   fn2(function (fn4) {
//     fn4(function () {
//       console.log("fn5 accept");
//     });
//   });
// });


// ===================================


// function alex(fn){
//     fn(function(fn3){
//         fn3(function(fn5){
//             fn5()
//         })
//     })
// }

// alex(function(fn2){
//     fn2(function(fn4){
//         fn4(function(){
//             console.log("Function 5 Running");
//         })
//     })
// })

// jaha function call ho raha hai, waha ak function de sakte ho, aur jisne diya usne accept karna padega

// ===================================

// github se repository data lao

// gitUserDetails(username, cd)
// getAllRepoS(userid, cb)
// getRepoDetail(repos[0], cb)












// ===================================

// understanding `promises`-`pending`, 'resolved', 'rejected'

// ===================================
// how to prevent from callback hell using async & await
// setInterval and setTimeout in JS
// JS = Single threaded
// ek kaam, ek bar main kar payegi

// ===================================
// ===================================
