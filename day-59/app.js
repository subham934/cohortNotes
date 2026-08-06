// setTimeout(() => {
//     console.log("hello");
// }, 2000);

// function greet(name, callback){
//     console.log("Hello", name);
//     callback();
// }

// function sayBye(){
//     console.log("Goodbye!");
// }

// greet("Subham", sayBye);

// ===============================

// let numbers = [23 , 18, 89, 29, 8, , 63, 16]

// numbers.forEach((num)=>{
//     console.log(num*2);
// })

// const prices = [100, 200, 300];

// const discountedPrices = prices.map(function (price) {
//   return price - 50;
// });

// console.log(discountedPrices);

// ===============================

let button = document.querySelector("button");
button.addEventListener("click", function () {
  console.log("Button Clicked");
});

// ===============================

// function calculate(a,b,operation){
//     operation(a,b);
// }

// function add(x,y){
//     console.log(x+y);
// }

// calculate(10,20,add)

// calculate(10, 16, (h, m)=>{
//     console.log(h*m);
// })

// ===============================

// function abcd(fn){
//     fn()
// }

// abcd(function (){
//     console.log('hey');
// })

// ===============================

function abcd(fn) {
  fn(function (fn2) {
    fn2(function () {
      console.log("Hello Jesus");
    });
  });
}

abcd(function (fn2) {
  console.log("Ola Amigo");
  fn2(function (fn3) {
    fn3();
  });
});

// function xyz(a,b, oper){
//     console.log(a,b, oper(a,b));

//     console.log(a);
//     console.log(oper(a,b));

// }

// xyz(10,20, function(a,b){
//     return a+b
// })



// function abc(fn){
//     fn(function(fn3){
//         console.log("Hello, Ronald Weisley");
//         fn3((fn5)=>{
//             console.log("Yes, in fact i've better intension to help them , become responsible for serious position in the Ministry of Magic.");
//             fn5()
//         })
//     })
// }

// abc(function(fn2){
//     console.log('hello, James Potter');
//     fn2(function(fn4){
//         console.log("I hear tht you have been corrupting the magic community with the silly mud bloodz!!");
//         fn4(function(){
//             console.log("Damn you Potter!! The land of magic is only  for the ones with purity in the royal blood to attain such high lavel of skill. Muggles just stand there pointless  ");
//         }
//         )
        
//     })
// })