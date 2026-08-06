// let s = 'string'
// console.log(s.charCodeAt(1));
// console.log(s.charAt(1));

// Toggle each alphabet of string

// let prompt = require("prompt-sync")()
// let s= prompt("Enter a String: ")

// let ans = "";

// for(let i = 0; i<s.length; i++){
//     let ascii = s.charCodeAt(i);
//     if(ascii >=65 && ascii <= 90){
//         ans = ans + String.fromCharCode(ascii + 32) + ""
//     }else if (ascii >= 97 && ascii <= 122){
//         ans = ans + String.fromCharCode(ascii - 32) + ''
//     }else{
//       ans = ans + s[i]
//     }
// }

// console.log(ans);

// ==========================================

// let prompt = require("prompt-sync")()

// let words = ['pay', 'attention', 'practice', 'attend', 'attendence']
// let pref = 'at';
// let count = 0;

// for(let i = 0; i<words.length ; i++){
//     if(words[i].startsWith(pref)){
//         count++
//     }
// }

// console.log(count);

// ==========================================
// capitalize the first and last word of  sentence
// ==========================================

// let prompt = require('prompt-sync')()
// let sentence = prompt("Enter a Sentence: ")

// let splited = sentence.split(' ')

// let ans = '';

// for(let i = 0; i<splited.length; i++){
//     let word = splited[i]
//     let first =  word.charAt(0).toUpperCase();
//     let mid = word.substring(1, word.length-1)
//     let last = word.charAt(word.length-1).toUpperCase()
//     ans = ans + (first+mid+last)+ " "
// }

// console.log(ans);
// console.log(charCodeAt(99));

// console.log("hello");
// console.log();

// ==========================================
// accept a string and print the frequency of each character
// ==========================================

// let s = "malayalam";
// let arr = new Array(128).fill(0);

// for (let i = 0; i < s.length; i++) {
//   let ascii = s.charCodeAt(i);
//   //   console.log(ascii);
//   arr[ascii] = arr[ascii] + 1;
// //   console.log(arr[ascii]);
// }

// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] > 0) {
//     console.log(String.fromCharCode(i) + "->" + arr[i]);
//   }
// }

// =======================================
// since all the input are in small letter, there is one more way of doing it as below
// =======================================

// let s = "malayalam";
// let arr = new Array(26).fill(0);
// for (let i = 0; i < s.length; i++) {
//   let ascii = s.charCodeAt(i);
//   arr[ascii-97] = arr[ascii-97] + 1;
// }
// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] > 0) {
//     console.log(String.fromCharCode(i+97) + "->" + arr[i]);
//   }
// }

// ==========================================
// check two strings are Anagram or Not. Anagram words have the same word length & same character count.

// EG: arc & car || taste && state
// ==========================================

// let s1 = "taste";
// let s2 = "state";

// if (s1.length === s2.length) {
//   let arr = new Array(26).fill(0);
//   for (let i = 0; i < s1.length; i++) {
//     let ascii = s1.charCodeAt(i);
//     // console.log(ascii);
//     arr[ascii - 97] = arr[ascii - 97] + 1;
//   }

//   for (let i = s2.length - 1; i >= 0; i--) {
//     let ascii = s2.charCodeAt(i);
//     arr[ascii - 97] = arr[ascii - 97] - 1;

//     if (arr[ascii - 97] < 0) {
//       console.log("Not an anagram");
//       return;
//     }
//   }
//   console.log("Anagram");
// } else {
//   console.log("Not an anagram");
// }

// ==========================================
// Maximum number of words Found in Sentence:
// ==========================================

// let sentence = "bright stars shimmer softly above the quiet ocean tonight";

// let words = sentence.split(' ');
// console.log(words.length);

// ==========================================
// find maximum letter in the sentence
// ==========================================

// let sentence = "bright stars shimmer softly above the quiet ocean tonight";

// let arr = new Array(26).fill(0);

// for (let i = 0; i < sentence.length; i++) {
//   let ascii = sentence.charCodeAt(i);
//   if (ascii >= 97 && ascii <= 122) {  //ignore spaces & symbols
//     arr[ascii - 97]++;
//   }
// }

// let max = 0;
// let letter = "";

// for (let i = 0; i < 26; i++) {
//   if (arr[i] > max) {
//     max = arr[i];
//     letter = String.fromCharCode(i + 97);
//   }
// }

// console.log("Most frequent letter:", letter);
// console.log("Count:", max);

// ==========================================
// sort the word of Sentence according to length:
// ==========================================

// let s = "taj mahal is situated at agra";

// let ans = s.split(' ').sort((a,b)=> a.length - b.length).join(' ')
// console.log(ans);

//we can also use bubble sort as below:

// let arr = s.split(' ')
// let n = arr.length;

// for(let i = 0; i<n-1; i++){
//     for(let j = 0; j<n-i-1; j++){
//         if(arr[j]>arr[j+1]){
//             let temp = arr[j]
//             arr[j] = arr[j+1]
//             arr[j+1] = temp;
//         }
//     }
// }

// console.log(arr.join(' '));
// //
// ======================================

// function digitCount(num) {
//   // Write your code here
//   let arr = new Array(10).fill(0);

//   for (let i = 0; i < num.length; i++) {
//     arr[num[i]]++;
//   }

//   for (let i = 0; i < num.length; i++) {
//     if (num[i] != arr[i]) {
//       return false; // fail fast
//     }
//   }

//   return true;
// }

// console.log(digitCount("1210"));

// ======================================

// function removeAnagrams(words) {
//   let result = [];
//   let pracResult = [];
//   for (let i = 0; i < words.length; i++) {
//     getkey = words[i].split("").sort().join("");
//     pracResult.push(getkey);
//     if (i === 0 || pracResult[i] !== pracResult[i - 1]) {
//       result.push(words[i]);
//     }
//   }

//   return result;
// }
// let words = ["abba", "baba", "aabb", "cd", "dc"];

// console.log(removeAnagrams(words));

// ======================================

// function digitSum(s, k) {
//   while (s.length > k) {
//     let prac = [];
//     let str = "";
//     for (let i = 0; i < s.length; i++) {
//       str += s[i];
//       if (str.length === k) {
//         prac.push(str);
//         str = "";
//       }
//     }
//     if (str.length > 0) {
//       prac.push(str);
//     }

//     let newPrac = [];
//     prac.forEach((ele) => {
//       let sum = 0; // 👈 yaha hona chahiye

//       ele.split("").forEach((e) => {
//         sum += Number(e);
//       });

//       newPrac.push(sum);
//     });

//     s = newPrac.join("");
//   }
//   console.log(s);
// }
// digitSum("12345678", 3);

// ======================================

// function areNumbersAscending(s) {
//   // Write your code here
//   let arr = s.split(" ");
//   let prev = -1;

//   for (let i = 0; i < arr.length; i++) {
//     if (!isNaN(arr[i])) {
//       let num = Number(arr[i]);
//       if (num <= prev) {
//         return false;
//       }
//       prev = num;
//     }
//   }

//   return true;
// }

// areNumbersAscending("1 box has 3 blue 4 red 6 green and 12 yellow marbles");

// ======================================

function reversePrefix(word, ch) {
  let i = word.indexOf(ch);
  return (
    word
      .slice(0, i + 1)
      .split("")
      .reverse()
      .join("") + word.slice(i + 1)
  );
}

console.log(reversePrefix("abcdefd", "d"));
