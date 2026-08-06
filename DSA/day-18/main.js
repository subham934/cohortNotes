// ============================
// Array Left Rotation by 1
// ============================

// let arr = [1,2,3,4,5]

// let temp = arr[0]

// for(let i = 1; i<arr.length; i++){
//     arr[i-1] = arr[i]
// }

// arr[arr.length-1] = temp;
// console.log(arr);

// ============================
// Array Right Rotation by 1
// ============================

// let arr = [34, 23, 55, 19, 89];
// let temp = arr[arr.length - 1];

// for (let i = arr.length - 1; i > 0; i--) {
//   arr[i] = arr[i - 1];
// }

// arr[0] = temp;

// console.log(arr);

// ============================
// Array Right Rotation by K element
// ============================

// let arr = [34, 23, 55, 19, 89];
// let k = 2;

// for (let j = 1; j <= k; j++) {
//   let temp = arr[0];
//   for (let i = 1; i < arr.length; i++) {
//     arr[i - 1] = arr[i];
//   }
//   arr[arr.length - 1] = temp;
// }

// console.log(arr);


// ============================
// Print the count of subarrays whose sum is equal to the target.(Ex- {1,2,3,7,5}) T-12
// ============================

let arr = [1,2,3,7,5]
let target = 12;
let sum = 0;
let count = 0;

for(let j = 0; j<arr.length; j++){
    for(let i = j; i<arr.length; i++){
        sum += arr[i]
        if(sum == target){
            count++;
        }
    }
    sum = 0;
}

console.log(count);

