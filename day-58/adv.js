// let Animal = class {
//   constructor() {
//     this.name = "dodo";
//     this.breed = "dog";
//   }
// };
// let ani = new Animal();
// console.log(ani);

// class Ani {
//   constructor() {
//     this.name = "sumo";
//     this.breed = "cat";
//   }
// }
// let animal = new Ani();
// console.log(animal);

// ===========================================

// class Animal{
//     constructor(){
//         this.hand = 2;
//         this.legs = 2;
//     }
//     eat(){
//         console.log("eat");
//     }
//     breath(){
//         console.log("breath");
//     }
// }

// Animal.prototype.dance = ()=>{
//     console.log("dance");
// }

// let men = new Animal();
// console.log(men);
// men.eat()
// men.breath()
// men.dance()

// class Kakda extends Animal{
//     constructor(){
//         super();
//         this.legs = 8;
//     }
//     susu(){
//         console.log("they pee too");
//     }
// }

// let kakda = new Kakda();
// console.log(kakda);
// console.log(kakda.hand);
// console.log(kakda.legs);
// kakda.eat()
// kakda.breath()
// kakda.dance()
// kakda.susu()

// ===============================================

// class Animal {
//     constructor(){
//         this._age = 12;
//     }
// }

// let a1 = new Animal()

// a1._age = 23;
// console.log(a1._age);

// =========================================

// now i'm just doing the repeat class of day-57 & day-58

// =========================================

// we need modular, maintainable, scalable, easy to read , easy to manage

// let obj = {
//     name: 'harsh',
//     age: 27,
//     email: 'harsh@gmail.com',
//     address: "advafsdfasd"
// }

// console.log(obj);

// class Bottle {
//   constructor() {
//     this.color = "blue";
//     this.material = "plastic";
//     this.price = 132;
//   }
//   fill() {}
//   drink() {}
// }

// let bottle1 = new Bottle();
// console.log(bottle1);

// let bottle2 = new Bottle();
// console.log(bottle2);

// class Sketch{
//     constructor(){
//         this.character = "doremon";
//         this.color = "blue";
//         this.height = "2feet";
//         this.someFunc = function(){}
//     }
// }

// Sketch.prototype.speak = function(){}
// Sketch.prototype.walk = function(){}

// let d1 = new Sketch()
// console.log(d1);

// this values:

// global => window
// console.log(this);
// // function => window

// function abc() {
//   console.log(this);
// }

// abc();

// // es5 function inside object => object

// let obj1 = {
//   name: "harsh",
//   func: function () {
//     console.log(this);
//   },
// };

// obj1.func();

// // es6 function inside object => window
// let obj2 = {
//   name: "harsh",
//   func: () => {
//     console.log(this);
//   },
// };
// obj2.func();

// // es5 function inside es5 function inside object => window

// let obj3 = {
//   name: "subham",
//   func: function () {
//     const abcd = function () {
//       console.log(this);
//     };
//     abcd();
//   },
// };

// obj3.func();

// // es6 function inside es5 function inside object => object

// let obj4 = {
//   name: "Subham",
//   func: function () {
//     const abcd = () => {
//       console.log(this);
//     };
//     abcd();
//   },
// };

// obj4.func();

// let h1 = document.querySelector('h1')
// h1.addEventListener('mouseover', function(){
//     console.log(this);

// })

// call, apply, bind

// ek function main this ki value window hoti hai, agar aap chahte ho ki wo value window na ho but koi aur object ho , aap use kar sakte ho call, apply, bind ka

// let obj = {
//   name: "harsh",
// };

// function abc() {
//   console.log(this);
// }

// abc.call(obj);

// function abc(a,b,c) {
//   console.log(this,a,b,c);
// }
// abc.apply(obj, [1,2,3]);

// function abc(a,b,c) {
//   console.log(this,a,b,c);
// }
// let newFnc = abc.bind(obj, 1,2,3);

// newFnc()

// call = func chalata hai and this ki value set karta hai
// apply = wahi karta hai jo call karta hai and arguements main pehli value this ki and doosri value array hoti hai
// bind = wahi karta hai jo call karta hai and appko naya func deta hai

// var Animal = class{
//     constructor(){
//         this.name = "dodo";
//         this.breed = "dog"
//     }
// }

// let an1 = new Animal()
// console.log(an1);

// class Animal{
//     constructor(){
//         this.hands = 2;
//         this.legs = 2;

//     }
//     eat(){}
//     breathe(){}
// }

// class Kakda extends Animal{
//     constructor(){
//         super();
//         this.legs = 8;
//     }
//     susu(){}
// }

// let k1 = new Kakda()
// console.log(k1);

// inheritance = agar koi class hai jisme kuch likha hai and app maante ho ek nayi class usi ka extension hai to aap wo saare features purani class se borrow kar sakte ho and nayi class main use kar sakte ho and apne naye features bhi bana sakte ho

// class Animal{
//     constructor(){
//         this._age = 12
//     }

//     set age(val){
//         if(val<0){
//             console.error( "Not possible");
//             return;
//         }
//         this._age = val
//         return this._age
//     }

//     get age(){
//         return this._age;
//     }

// }

// let a1 = new Animal()
// console.log(a1.age);
// a1.age = 32;
// console.log(a1._age);

// 1.	Create a user object that stores name and email and has a login method which prints “User logged in”.

// let user = {
//     name: 'harsh',
//     email: "raja@gmail.com",
//     login: function(){
//         console.log('loggged In');
//     },
// }

// user.login()

// class User {
//   constructor(name, email) {
//     this.name = name;
//     this.email = email;
//     this.loggedin = function () {
//       console.log("loggedIn");
//     };
//   }

//   logged() {
//     console.log("logged");
//   }
// }

// let user = new User("harsh", "h@haa.com");
// let userX = new User("harshita", "harshita@haa.com");
// let userY = new User("harshit", "hharshit@haa.com");
// console.log(user);
// console.log(userX);
// console.log(userY);

// ================================================

