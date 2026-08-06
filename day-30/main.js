// operators in JS
// 1. Arithmatic Operators
// + - * / % **

// let a = 12 + 12;
// let b = 12 - 10;
// let c = 12 * 12;
// let d = 12 / 4;
// let e = 12 % 13;
// let f = 2 ** 3;
// console.log(a, b, c, d, e, f);


//2. Assignment operator
// = += -= *= /= %=
// equal = value dene main use 

// let a = 12;
// // += value ko perticular se badhana
// a += 13;
// console.log(a);
// a-=5;
// console.log(a);
// a*= 2;
// console.log(a);
// a/=4;
// console.log(a);
// a%=3;
// console.log(a);


// 3. Comparison Operator
// == === != !== > < >= <=
// == not strict compare
// === strict compare , ALWAYS USE THIS
// != not equal, NEVER USE THIS
// !== , ALWAYS USE THIS

// console.log(12 == "12");
// console.log(12 === "12");
// console.log(12 != '12');
// console.log(12 !== '12');
// console.log(12 > 13);
// console.log(12 < 13);
// console.log(12 >= 12);
// console.log(13 <= 12);




// 4. Logical Operator
//  I know it all about logical operator
// && || !

// true && true = true
// true && false = false
// false && true = false
// false && false = false



// 5. Ternary Operator
// condition ? valueIfTrue : valueIfFalse
// let age = 18;
// let canVote = age >= 18 ? "Yes, you can vote" : "No, you cannot vote";
// console.log(canVote);


// let isLoggedIn = true;
// let isPremiumUser = false;
// let role = "admin";

// let message = isLoggedIn
//   ? (isPremiumUser
//       ? "Welcome Premium User!"
//       : (role === "admin"
//           ? "Welcome Admin — Full Access Granted!"
//           : "Welcome Regular User — Upgrade for more features!"))
//   : "Please log in to continue.";

// console.log(message);


// 6. Type checking Operator

// typeof
//instanceof

// let x = 10;
// let y = "Hello";
// let z = true;
// let obj = { name: "Subham" };
// let arr = [1, 2, 3];

// console.log(typeof x);    // "number"
// console.log(typeof y);    // "string"
// console.log(typeof z);    // "boolean"
// console.log(typeof obj);  // "object"
// console.log(typeof arr);  // "object" (arrays are objects!)
// console.log(typeof null); // "object" (weird JS quirk)


// instanceof checks whether an object was created from a particular constructor function or class, using the prototype chain.

function Person(name) {
  this.name = name;
}

let p = new Person("Subham");
let p1 = new Person("Harsh");
let p2 = new Person("Rahul");

console.log(p1.name); // Harsh
console.log(p2.name); // Rahul

// let arr = [1, 2, 3];
// let date = new Date();

// let g = 12;

// console.log(g instanceof Number);

// console.log(p instanceof Person);  // true
// console.log(arr instanceof Array); // true
// console.log(arr instanceof Object); // true (because Array inherits from Object)
// console.log(date instanceof Date); // true
// console.log(date instanceof Object); // true




// 7. String Operator
// +(for concatenation)

// let p = "Subham" + " Dhar"
// console.log(p);



// 8. Spread/Rest Operator

// spread in array and Object
// let arr = [1,2,3,4]
// let arr2 = [...arr]
// console.log(arr2);


// rest in function


// 9. Nullish Coalescing Operator
// ?? (fallback only when null/undefined)

// console.log(12>13 ?? "sorry");
// console.log(undefined ?? "sorry babu")
// console.log(null ?? "sorry")


// 10. Optional Chaining = I know it, see coding addict video


// 11. Variable Hoisting in JS
// hoisting ka matlab hai, variable ko banane se pehle bhi use kiya ja sakta hai
// hoisting me aapka variable toot jata hai do hisso main
// declaration top of the file jaata hai
// initialization wahi rehta hai jaha variable tha
// ab aapka variable error nahi deta , kyunki wo hamesha use hone se pehle exist kr rha tha


// console.log(b);
// var b = 12;
// console.log(b);

// hoisting dont work with let and const