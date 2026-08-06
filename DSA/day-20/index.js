// Linear Search
// const prompt = require("prompt-sync")();
// let arr = [20, 10, 5, 8, 45, 69, 12, 18];

// let t = +prompt("Enter search element: ");
// let index = -1;

// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] == t) {
//     index = i;
//     break;
//   }
// }

// console.log(index == -1 ? "Not Found" : "Found at " + index);


// this is not a efficient way to search an element in an array, because we have to traverse the entire array in worst case. The time complexity of this algorithm is O(n).

// ====================================

// Binary Search : it is a efficient way to search an element in a sorted array, because we can eliminate half of the array in each step. The time complexity of this algorithm is O(log n).

const prompt = require("prompt-sync")();
let t = +prompt("Enter search element: ");
let arr = [5, 8, 10, 12, 18, 20, 45, 69, 79, 88, 94, 100];

let start = 0;
let end = arr.length - 1;
let index = -1;
while (start <= end) {
  let mid = Math.floor((start + end) / 2);
  if (arr[mid] == t) {
    index = mid;
    break;
  } else if (arr[mid] < t) {
    start = mid + 1;
  } else {
    end = mid - 1;
  }
}

console.log(index == -1 ? "Not Found" : "Found at " + index);

// ====================================
