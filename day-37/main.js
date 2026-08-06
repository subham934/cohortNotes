// understanding function in js and why its widely used- [parameter, arguements, rest parameters, hoisting, variable hoisting, function hoisting]

// function aalooParatha(){
//     console.log(`Paratha `);

// }

// aalooParatha()
// aalooParatha()
// aalooParatha()

// code ko reuse karne main help karta hai
// function aapke code ko tab chalata hai jab aap chaho

// function abcd(age, name){ // parameters

// }

// abcd(1234, 'raja') // arguements

// Rest Parameter
// function abcd(a,b,...reebok){
//     console.log(a, b, reebok);
// }

// abcd(1,2,3,4,5,6);

// variable hoisting
// console.log(a);
// var a = 12;

// function hoisting

// abcd()
// function abcd(){
//     console.log('hey');

// }

// a()
// var a = function(){
//     console.log(`Hay`);
// }

// Parameters in JS - [`required`, "destructured", "rest", "default"]
// function abcd(a,b,c,d){

//     console.log(a,b,c,d); // undefined undefined undefined undefined
//     // agar aapne parameter banaaye and aapne unme arguements nahi bheja to fir wo value parameter ki undefined ho jaayegi
// }

// abcd(2, 3);

// function abcd(obj){
// console.log(obj.name); // raja
// }
// abcd({name: 'raja', age: 27})

// function abcd({name, age}){
//     console.log(name, age);
// }

// abcd({name: 'raja', age: 27})



// function abcd(...val){
//     console.log(val);
// }
// abcd( 'raja', 27)

// function abc(a = 0, b=0,c=0){
//     console.log(a,b,c);
// }
// abc(1,2)

// Positional arguement

// function abc(a , b,c){
//     console.log(a,b,c);
// }
// abc(1,2,3)

// spread arguement

// function abc(a ,b,c){
//     console.log(a,b,c);
//     console.log(a);
//     console.log(b);
//     console.log(c);

// }
// let arr = [1,2,3]
// abc(...arr)

// Nested function
// function abcd(){
//     function defg(){
//         console.log(`defg chala`);

//     }
//     defg()
// }

// abcd()

// Scope Chain
// function abcd({name, age}){
//     console.log(name, age);
// }

// abcd({name: 'harsh', age: 27})

// function abcd(...val){
//     console.log(val);

// }
// abcd(1,2,3,4,5)

// default parameter
// function abcd(a,b,c=0){
//     console.log(a,b,c);
// }

// abcd(1,2)

// positional argruements
// function abcd(a,b,c,d){
//     console.log(a,b,c,d);
// }
// abcd(1,2,null,4)

// spread operator
// arr = [1,2,3,4]
// function abcd(a,b,c,d){
//     console.log(a,b,c,d);
// }
// abcd(...arr)



// Nested function
// function abcd(){
//     function defg(){
//         console.log(`defg chalege`);
//     }
//     defg()
// }
// abcd()




// scope chain
// let a = 12;
// function abcd() {
//   let b = 13;
//   function defg() {
//     console.log(b, a);
//   }
//   defg();
// }

// abcd();


// IIFE

// (function(){
//     console.log(`hello`);
//     let balance = 5000;

// })();

// // here, balance is not defined after the ()
// console.log(balance);



// let func = () =>{
//     console.log(`hello morbius`);
// }
// func()


// hof = ek aisa func jo ki return karde ek aur function OR ELSE
// wo func accept karle ek aur func parameter main

// function abcd(){
//     return function(){

//     }
// }



// function abcd(a){

// }
// abcd(function(){

// })


// function greet(name, a){
//     console.log("Hello", name);
//     console.log(a); // this will give undefined as a is not defined while calling the function    
// }

// greet('raja')




// function greet(name="Student"){
//     console.log("Hello", name);
// }

// greet()
// greet("Raja")


// Rest Parameter

// function sum(...numbers){
//     return numbers.reduce((acc, num)=> {
//         return acc+num;
//     }, 0);
// }

// console.log(sum(1,2,3,4));



// function add(a,b,c){
//     return a+b+c
// }

// const nums = [1,2,3]
// console.log(add(...nums));


// function greet(name, callback){
//     console.log("Hello", name);
//     callback()   
// }

// greet("Raja", function(){
//     console.log("I am a callback");
// })


const sayHi = () => {
    console.log("Hi, I am a first class function");
}

const run = sayHi;  
run()