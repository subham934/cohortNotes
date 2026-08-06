// Chota code kaisa bhi likh lo, chal jayega,
// bada code pe faila hua code nahi chalega
// we need to write modular, maintainable, scalable, easy to read and manage

// OOPS

// class Bottle  {
//     constructor(){
//         this.color = 'blue';
//         this.material = 'plastic';
//         this.price = 132;

//     }

//     fill(){}
//     drink(){}
// }

// let b1 = new Bottle
// console.log(b1);
// console.log(b1.material);
// console.log(b1.color);

// =========================

// class Sketch {
//   constructor() {
//     this.character = "doremon";
//     this.color = "blue";
//     this.height = "2feet";
//     this.someFunc = function () {
//       console.log("It's a function");
//     };
//   }
//   hello() {}
// }

// Sketch.prototype.speak = function () {};
// Sketch.prototype.walk = function () {};

// let sketch1 = new Sketch();
// console.log(sketch1);
// sketch1.someFunc();

// =========================

// function todo(){

//     console.log(this);
// }
// todo()

// ===================================
// global => this => window
// function => this => window
function abcd() {
  console.log(this);
}

abcd();
// es5 function inside object => this => object

let obj = {
  name: "harsh",
  abcd: function () {
    console.log(this);
    console.log(this.name);
  },
};

obj.abcd();
// es6 function inside object => this => window

let obj1 = {
  name: "harsh",
  abcd: () => {
    console.log(this);
  },
};

obj1.abcd();

// es5 function inside es5 function inside object => this => window

let obj2 = {
  func: function () {
    function abcd() {
      console.log(this);
    }
    abcd();
  },
};

obj2.func();

// es6 function inside es5 function inside object => this => object

let obj3 = {
  nam: "raja",
  func: function () {
    const abcd = () => {
      console.log(this);
      console.log(this.nam);
    };
    abcd();
  },
};

obj3.func();

// ES5 function inside ES6 function inside object -> window

let obj4 = {
  name: "harsh",
  func: () => {
    function abcd() {
      console.log(this);
    }
    abcd();
  },
};

obj4.func();

// ================================

let h1 = document.querySelector("h1");

h1.addEventListener("click", function () {
  console.log(this);
});

// ==========================

// setTimeout(function () {
//   console.log(this);
// }, 1000);

// setTimeout(() => {
//     console.log(this);
// }, 2000);

// =================

// ak function main this ki value window hoti hai, agar aap cahe ki wo value window naa ho par koi aur object ho tab aap use kar sakte ho call apply bind ka.

// let bingo = {
//   age: "twentytwo",
// };

// function getThis(a, b, c) {
//   console.log(this, a, b, c);
//   return a + b + c;
// }

// getThis.call(bingo, 1, 2, 3);


// ======================

// let bingo = {
//     age : "twentytwo"
// }

// function getThis(a,b,c){
//     console.log(this);
//     return a+b+c

// }

// console.log(getThis.call(bingo,1,2,3));

// ======================

// let bingo = {
//     age : "twentytwo"
// }

// function getThis(a,b,c){
//     console.log(this,a,b,c);

// }

// getThis.apply(bingo,[1,2,3]);

// =======================

// let bingo = {
//     age : "twentytwo"
// }

// function getThis(a,b,c){
//     console.log(this,a,b,c);

// }

// let newFnc = getThis.bind(bingo,1,2,3);

// newFnc()
