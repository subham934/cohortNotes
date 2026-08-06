// ========================================
// Bubble Sort
// ========================================

// let arr = [9, 8, 1, 10, 4, 78, 23, 45, 67, 34];


// agar n number of eleemnts hai toh n-1 passes honge




// function bubbleSort(arr) {
//   let n = arr.length;
//   for (let i = 0; i < n - 1; i++) {
//     // this loop is for the number of passes
//     for (let j = 0; j < n - i - 1; j++) {
//       // this loop is for the number of comparisons in each pass
//       if (arr[j] > arr[j + 1]) {
//         let temp = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = temp;
//       }
//     }
//   }
//   return arr;
// }

// console.log(bubbleSort(arr));


// ========================================
// Selection sort
// ========================================


// let arr = [9, 8, 1, 10, 4, 78, 23, 45, 67, 34, 2];

// let n = arr.length;

// for (let i = 0; i < n - 1; i++) {
//   let min = i;
//   for (let j = i + 1; j < n; j++) {
//     if (arr[j] < arr[min]) {
//       min = j;
//     }
//   }
//   if (min !== i) {
//     let temp = arr[min];
//     arr[min] = arr[i];
//     arr[i] = temp;
//   }
// }
    
// console.log(arr);

// let arr = [42, 7, 19, 88, 3, 56, 21, 90, 14, 65, 2, 37];
// let n = arr.length;

// for (let i = 0; i < n - 1; i++) {
//   let min = i;
//   for (let j = i + 1; j < n; j++) {
//     if (arr[j] < arr[min]) {
//       min = j;
//     }
//   }

//   if (min != i) {
//     let temp = arr[min];
//     arr[min] = arr[i];
//     arr[i] = temp;
//   }
// }

// console.log(arr);

// ========================================
// Insertion sort
// ========================================
  
// let arr = [9, 8, 1, 10, 15, 7, 34, 2, 94, 47];
// let n = arr.length;

// for (let i = 1; i < n; i++) {
//   let key = arr[i];
//   let j = i - 1;

//   while (j >= 0 && arr[j] > key) {
//     arr[j + 1] = arr[j];
//     j--;
//   }

//   
//     arr[j + 1] = key;
//   }
// 

// console.log(arr);
