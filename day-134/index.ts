// console.log("Hello");

// const a: String  = "Hello";

// const b: number  = 20;

// const x: boolean = false;
// const y: boolean = true;

// const ar: number[] = [10, 23, 13, 3,85]
// // Array of strings
// const arr:Array<string> = ["a","b","c"];
// // Array of numbers
// const arr1:Array<number> = [1,2,3];
// // Array of booleans
// const arr2:Array<boolean> = [true,false,true];
// // Array of any type
// const arr3:Array<any> = [1,"a",true];
// // 2D array of numbers
// const arr4:Array<Array<number>> = [[1,2],[3,4]];
// // 3D array of numbers
// const arr5:Array<Array<Array<number>>> = [[[1,2],[3,4]],[[5,6],[7,8]]];
// // 4D array of numbers
// const arr6:Array<Array<Array<Array<number>>>> = [[[[1,2],[3,4]],[[5,6],[7,8]]],[[[9,10],[11,12]],[[13,14],[15,16]]]];

// console.log(a,b);
// console.log(typeof a, typeof b,typeof x,typeof y)

// const ar: number[] = [10, 23, 13, 3,85]
// ar.push(23);
// // ar.push("string") // this will throw error
// ar.push(21);
// ar.push(84);
// ar.push(73);
// i can push any number of items in an array , provided that they are just number

//===========================================

// this is tuple (i can only push the number of items that are specified in the tuple)

// Array = fixed type but not length;
//Tuple = fixed size and fixed type

// const a: [number, number, number] = [1,2, 4]
// a.push(5);
// const x = a[3] // accessing out of bound index and hence it will throw error as tuple is fixed size
// console.log(x)
// console.log(a);

// index.ts:51:13 - error TS2493: Tuple type '[number, number, number]' of length '3' has no element at index '3'.
// 51 const x = a[3] // accessing out of bound index and hence it will throw error as tuple is fixed size
// Found 1 error in index.ts:51

// const a: [number, string, number] = [1,"2", 4]
// a.push(5)
// console.log(a);

//===========================================
// VOID
//===========================================
// function greet(name: string){
//     console.log("Hello" + name)
// }

// greet("cohort")

// here the function is not returning anything , so it is void

// function getFirstname(name: string) {
//   return name.split(' ')[0];
// }

// getFirstname('cohort');

// here the function is returning something , so it is not void

//===========================================
//  function that return something
//===========================================

// function add(a: number, b: number):string {
//     return a + b
// }

// console.log(add(1,2))

// this will show error as we are actually returning number but as per function definition we are returning string
//  Type 'number' is not assignable to type 'string'.

// return a + b

//===========================================

// function sub(a: number, b: number):number {
//     return a - b
// }

// console.log(sub(5,2))
// this will not show any error because we are returning number and as per function definition we are returning number

//===========================================

// function greet(name: string): void {
//   console.log('Hello' + name);
// }

// greet('cohort');
//===========================================

// now what is if function never ends

// function greet(name: string) {
//   throw new Error('Something went wrong!');
// }
// greet('cohort');

// this above function will never end , it will throw error before end and will shut down the running programm

// function greet(name: string): never{
//   throw new Error('Something went wrong!');
// }
// greet('cohort');

// to solve the issue we use never, never is used for infinite loops
// and infinite loop does not return anything

//===========================================
// type

// const user = {
//   name: 'hamza',
//   age: 34,
//   isMale: true,
// };

// function greet(data: { name: string; age: number; isMale: boolean }) {
//   console.log('hello ' + data.name + ' your age is ' + data.age);
// }
// We can write this function as below::

// type USER = {
//   name: string;
//   age: number;
//   isMale: boolean;
// };

// const user: USER = {
//   name: 'hamza',
//   age: 34,
//   isMale: true,
// };


// function greet(data: USER): void {
//   console.log('hello ' + data.name + ' your age is ' + data.age);  
// }
// greet(user);




/**
 * any, unknown
 */

// let a:any
// a = "Hello"
// console.log(a.toUpperCase())
// here, any means the datatype of a can be any of the data types like string, number, boolean, array, object, tuple, void, never  etc.
// but we can perform any operation on it.

// let a:any
// a = 123
// console.log(a.toUpperCase()) // this will throw error from JS side because number does not have toUpperCase method but if we do a= "hello" then it will work , so we should avoid using any

// let b:unknown
// b = 123

// if(typeof b === "string"){
//     console.log(b.toUpperCase())
// }else{
//     console.log("b is not a string")
// }
// unknown is safer than any because it forces us to check the type before using it.
