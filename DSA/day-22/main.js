// let name = 'subham'

// console.log(typeof name);
// console.log(name);
// console.log(name[2]);
// console.log(name.length);
// name[3] = 'x'
// console.log(name) // string = immutable

// let s = 'Sheryians'
// console.log(s.slice(0, 5));
// console.log(s.slice( 5));
// console.log(s.slice( -3));
// console.log(s.slice(5,2)); // starting index can neve be bigger, the numbers should swap, for that we use substring
// console.log(s.substring(5,2));
// console.log(s.substring(-3)); // this thing will never work
// console.log(s);
// console.log(s.split(''));
// let p = "     jewellery   "
// console.log(p);
// p = p.trim()
// console.log(p);
// let s = 'sheryians'
// console.log(s.concat(" coding", ' school'));
// console.log(s);

// console.log(s.indexOf("hery"));
// console.log(s.includes("hery"));

// let g = "hello bhai kaise ho"
// console.log(g.split(' '));
// console.log(g.split(''));

// let a = "hello_bhai_kaise ho, sab thik hai na"
// console.log(a.split("_"));

// let s = 'sheryians'

// for(let i = 0; i<s.length; i++){
//     console.log(s.charAt(i));
// }
// console.log('hello');

// for(let i = s.length - 1; i>=0; i--){
//     console.log(s.charAt(i));

// }

// let s = "sheryians";
// let rev = "";

// for (let i = s.length - 1; i >= 0; i--) {
//   rev = rev + s.charAt(i);
// }

// console.log(rev);

// ================================

// let s = 'naman'
// let rev = ""

// for(let i = s.length - 1; i>= 0; i--){
//     rev = rev + s.charAt(i)
// }

// console.log(rev == s);

// //=================================

let prompt = require("prompt-sync")();
let s = prompt("Enter a String: ");

let i = 0;
j = s.length - 1;
let isPalindrom = true;

while (i < j) {
  if (s.charAt(i) != s.charAt(j)) {
    inPalindrom = false;
    break;
  }
  i++;
  j--;
}

console.log(isPalindrom ? "Pallindrome" : "Not a Pallindrome");


// //=================================
// Palindromic string with two pointer
// let prompt = require("prompt-sync")();
// let m = prompt("Enter a string");

// let i = 0;
// j = m.length - 1;
// let isPallindrom = true;
// while (i < j) {
//   if (m.charAt(i) != m.charAt(j)) {
//     isPallindrom = false;
//     break;
//   }
//   i++;
//   j--;
// }

// console.log(isPallindrom ? "Pallindrome" : "Not a Pallindrome");

let str = "apple,banana,grape";
let result = str.split(",");
console.log(result[1]);
