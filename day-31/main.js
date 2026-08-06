// let a = 10;
// let b = 3;

// console.log(a+b);
// console.log(a-b);
// console.log(a/b);
// console.log(a%b);
// console.log(a*b);
// console.log(a**b);



// let x = 5;
// x = x+3;
// x+=3
// x-=3;
// x*=3;
// x/=3;
// console.log(x);


// let count=5;
// console.log(count);
// count++;
// console.log(count);
// ++count;
// console.log(count);



// let count = 5;
// console.log(count);
// count--;
// console.log(count);
// --count;
// console.log(count);



// console.log(5=="5");
// console.log(5==="5");



// console.log(10>5);
// console.log(10<20);
// console.log(10===10);


// let x = 10;
// if(x>5 && x<20 && x===10){
//     console.log("Mogambo khus hua!!!");
// }
// else{
//     console.log("Bhag bhosdika!!");
// }



// console.log(true && false);
// console.log(true || false);
// console.log(!false);


// hoisting works gr8 with function
// test();
// function test(){
//     console.log("hello");    
// }
// Function declarations are fully hoisted — meaning:
// The entire function body is moved to the top of the file
// JS knows about test even before executing any code




// hello()
// var hello = ()=>{console.log("Hello")}

// here is what happen in the above code:

// var hello;
// console.log(hello);
// hello()
// hello = ()=>{console.log("Hello")}



// Because with var, JavaScript hoists only the variable name, NOT the function.

// JS treats it like this:
// var hello;    // hoisted but undefined
// hello();      // ERROR ❌ Cannot call undefined
// hello = () => console.log("Hello");


// So when the engine reaches hello(), it is STILL:
// hello = undefined
// You cannot call undefined ⇒ 💥 TypeError



// test()
// function test() { console.log("Hello") }