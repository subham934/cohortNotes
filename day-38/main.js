// more on functions

// Anonymous function

// function(){
// }

// pure function: ak aisa funtion jo same input pe same output karta hai, koi side effect nahi hoga.

// let a = 12;
// function abcd(val){
//     console.log(val+2);
// }
// abcd(12); // output: 14
// abcd(12); // output: 14
// abcd(12); // output: 14
// abcd(12); // output: 14

// impure function: same input hone pe bhi different output ho sakta hai, koi side effect bhi ho sakta hai

// let a = 12;
// function abcd(val){
//     console.log(Math.random() + val);
// }

// abcd(a);
// abcd(a);
// abcd(a);
// abcd(a);

// display diff output everytime we call the function

// closeure -> ek function hai jo return karta hai function but returning function jo hai wo parent function ka koi variable use karega


// function abcd(){
//     let a = 12;
//     return function(){
//         console.log(a + 12);
//     };
// }

// const fn = abcd(); // fn now holds the inner function
// fn();              // prints 24


// let arr = [1,2,3,4,5,6]
// console.log(arr[5]);


// let arr2 = new Array('hello', 1, 22/7, 3/4, "e", 'kink');
// console.log(arr2);


// functions on Arrays- [push, pop, `shift`, `unshift`, `indexof`, `array destructuring`, `filter`, `some`, `map`, `reduce`, `spread operator`, `slice`, `reverse`, `sort`, `join`, `toString`]



// let arr = [1,2,3,4,5];

// console.log(arr.toString());


// arr.push(6)
// console.log(arr);

// arr.pop()
// console.log(arr);

// arr.shift()
// console.log(arr);

// arr.unshift(1)
// console.log(arr);

// console.log(arr.indexOf(4));


// let [a, ,b,...dj] = arr;
// console.log(a,b, dj);


// const nums = [1, 2, 3, 4, 5, 6];
// const evenNums = nums.filter(num => num % 2 === 0);
// console.log(evenNums);


// let arr = [1,2,3,4]
// let arr2 = [...arr]
// arr2[0] = 22
// console.log(arr);
// console.log(arr2);


// let arr = [1,2,3,4]

// for(let i = 0; i<4; i++){
//     console.log(arr[i]);
// }

// arr.forEach(function(val){
//     console.log(val);
    
// })



// let obj = {
//     name: 'subham',
//     age: 32,
//     email: `sid@gmail.com`,
// };


// let obj2 = new Object()



// let obj = {
//     name : `harsh`,
//     age: 27,
// }

// console.log(obj.name);
// console.log(obj["name"]);

// delete obj.name;
// console.log(obj);




// Nested Object
// let obj = {
//     name: 'harsh',
//     socials: {
//         instagram: 'bgk',
//         facebook: 'ghiskdf',
//     }
// }

// console.log(obj.name);
// console.log(obj.socials);
// console.log(obj?.socials?.instagram);
// console.log(obj?.socials?.facebook);

