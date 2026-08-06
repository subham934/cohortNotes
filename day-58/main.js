// class expression, hoisting, inheritence, getter & setter

// class expression

// let Animal = class {
//   constructor() {
//     this.name = "dodo";
//     this.breed = "dog";
//   }
// };
// let ani = new Animal();

// here Hoisting is not possible
// ================================================

// inheritance

// class Animal {
//     constructor(){
//         this.hands = 2;
//         this.legs = 2;
//     }
//     eat(){}
//     breath(){}
// }

// class Kakda extends Animal{
//     constructor () {
//         super();
//         this.legs = 8;
//         this.hands = 0;
//     }
//     susu(){}
// }

// let k1 = new Kakda;
// console.log(k1);

// agar koi class hai , jisme kuch kuch likha hai and aap maante ho ek nayi class usi ka extension hai to aap wo saare features purani class se borrow kar sakte ho and nayi class main use kar sakte ho and aapne nayi features bhi bana sakte ho.

// ================================================
// class Animal{
//     constructor(){
//         this._age =12 ;
//     }
// }

// let a1 = new Animal()
// a1._age = 28;
// console.log(a1._age);

// to help soleve the problem we have get & set

class Animal {
  constructor() {
    this._age = 12;
  }

  set age(val) {
    if (val < 0) {
      console.error("not");
      return;
    }
    this._age = val;
    return this._age;
  }

  get age() {
    return this._age;
  }
}

let a1 = new Animal();
console.log(a1.age);
a1.age = 37;
console.log(a1.age);

// ================================================
// SECTION 1: Objects and OOPS Thinking (Foundation)
// ================================================

// 1.	Create a user object that stores name and email and has a login method which prints “User logged in”.

// let user = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// user.login()

// ================================================

// 2.	Imagine you now have 5 users.
// First, think how you would manage them without using a class.
// Then convert the same logic using a class and observe how the code becomes cleaner. Write code for both approaches.

// let user1 = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// let user2 = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// let user3 = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// let user4 = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// let user5 = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// console.log(user1, user2);

// class User{
//     constructor(name, email){
//         this.name=name;
//         this.email = email;
//         this.loggedin = function(){
//             console.log('loggedIn');
//         }
//     }

//     logged(){
//         console.log('logged');

//     }

// }

// let user = new User("harsh", 'h@haa.com')
// let userX = new User("harshita", 'harshita@haa.com')
// let userY = new User("harshit", 'hharshit@haa.com')
// console.log(user);
// console.log(userX);
// console.log(userY);

// ================================================

// 	3.	Create a product object that stores name and price and has a method which returns the final price after discount.

// The goal of this section is to understand why keeping data and behavior together makes code easier to manage.

// let product = {
//     name : "cap",
//     price: 3300,
//     discountedPrice: function(){
//         return this.price - 200;
//     }
// }

// console.log(product.discountedPrice());

// ================================================
// SECTION 2: Classes and Objects
// ================================================
// 	4.	Create a Car class with the following:
// brand
// speed
// a drive method that prints the car brand and speed

// class Car{
//     constructor(brand, speed){
//         this.brand = brand;
//         this.speed = speed;
//     }
//     drive(){
//         return (this.brand + " - " + this.speed);
//     }
// }

// let car1 = new Car("Hyundai", 180)
// console.log(car1.drive());

// ================================================

// 	5.	Create two different car objects from the same class and verify that their data is different.

// class Car{
//     constructor(brand, speed){
//         this.brand = brand;
//         this.speed = speed;
//     }
//     drive(){
//         return (this.brand + " - " + this.speed);
//     }
// }

// let car1 = new Car("Hyundai", 180)
// console.log(car1.drive());

// let car2 = new Car("Maruti", 140)
// console.log(car2.drive());

// ================================================
// 	6.	Answer this in your own words:
// If classes did not exist, how would you write this logic and what problems might occur when the project becomes large?

// we had to create multiple object and so on, you know the drill....................

// ================================================
// SECTION 3: Constructor and this keyword
// ================================================

// 	7.	Create a Student class whose constructor accepts name and roll number.

// Add a method introduce that prints both values.

// class Student{
//     constructor(name, rollNo){
//         this.name = name;
//         this.rollNo = rollNo;
//     }
//     introduce(){
//         console.log(`Hi, I'm ${this.name} and my Roll No. is ${this.rollNo}`);

//     }
// }

// const harsh = new Student("Harsh", 23);
// harsh.introduce()

// ================================================

// 	8.	Inside the constructor, set values using this.
// Then try removing this and notice what error occurs and why.

// class Student {
//   constructor(name, rollNo) {
//     name = name;
//     rollNo = rollNo;
//   }
//   introduce() {
//     console.log(`Hi, I'm ${this.name} and my Roll No. is ${this.rollNo}`);
//   }
// }

// const harsh = new Student("Harsh", 23);
// harsh.introduce();

// The result is undefined

// ================================================
// 	9.	Create an object with two methods:
// One method using a normal function
// One method using an arrow function

// Inside both, print this and observe the difference.

// The goal is to clearly understand how this works and when it changes.

// let obj = {
//   sayName: function () {
//     console.log(this);
//   },
//   sayArrowName: () => {
//     console.log(this);
//   },
// };

// obj.sayName()
// obj.sayArrowName()

// ================================================
// SECTION 4: Constructor Functions and Prototypes
// ================================================

// 	10.	Create a User constructor function (do not use class syntax).
// bina class k bhi , constructor function banta hai,
// es6 se pehle constructor function aise banta tha

// function Janwar(){
//     this.name = "Harsh";
// }

// let duck = new Janwar();
// console.log(duck.name);

// function User(){
//     this.name = "Harish"
// }

// let harish = new User()
// console.log(harish.name);

// ================================================

// 	11.	Add a login method in two ways:
// First, inside the constructor
// Then, move the method to the prototype

// function User(){
//     this.name = "Harish";
//     this.login = function(){
//         console.log('loggedIn');

//     }

// }

// User.prototype.logging = function(){
//     console.log("Logging");

// }

// let harish = new User()
// console.log(harish.name);
// harish.login()
// harish.logging()

// ================================================

// 	12.	Create two User objects and compare their login methods using equality.
// Explain why the result is true or false.

// The purpose here is to understand how prototypes help share behavior efficiently.

// function User(val) {
//   this.name = val;
//   this.login = function () {
//     console.log("loggedIn");
//   };
// }

// User.prototype.logging = function () {
//   console.log("Logging");
// };

// let user1 = new User("satwik")
// let user2 = new User("sarthak")

// console.log(user1.logging === user2.logging);
// console.log(user1.login === user2.login);

// ⸻
// ================================================
// SECTION 5: call, apply, bind
// ================================================

// // 	13.	Create a function that prints this.name.

// function abcd() {
//   console.log(this.name);
// }

// let obj = {
//   name: "harsh",
// };

// abcd.call(obj);
// abcd()

// ================================================

// 	14.	Create an object that contains a name property.

// Use call to run the function using the object
// Use apply to run the function using the object
// Use bind to create a new function and then call it

// function abcd(a,b,c,d) {
//   console.log(this.name);
//   console.log(a,b,c,d);
  
// }

// let obj = {
//   name: "harsh",
// };
// abcd.apply(obj, [1,2,3,4])

// for bind do it yourself

// ================================================

// 	15.	Borrow a method from one object and run it for another object using call.

// The goal is to understand how this can be manually controlled


