let arr = [1, 2, 3, 4, 5];

function multiplyPrevNext(arr) {
  // Write your logic here
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      newArr.push(arr[i] * arr[i + 1]);
    } else if (i > 0 && i < arr.length - 1) {
      newArr.push(arr[i + 1] * arr[i - 1]);
    } else {
      newArr.push(arr[i - 1] * arr[i]);
    }
  }

  return newArr;
}

console.log(multiplyPrevNext(arr));

// Q) You are given an array of even size. an array is balanced if the sum of the first half of the array is equal to the sum of the second half of the array. Your task is to determine the minimum value that must  be added to atleast one element (either on left half or right half) to make the array balanced. If the array is already balanced, return 0.

function minValueToBalance(arr) {
  // Write your logic here
  let sum1 = 0;
  let sum2 = 0;
  let mid = arr.length / 2;

  for (let i = 0; i < mid; i++) {
    sum1 += arr[i];
  }

  for (let i = mid; i < arr.length; i++) {
    sum2 += arr[i];
  }

  if (sum1 === sum2) {
    return 0;
  } else {
    return Math.abs(sum1 - sum2);
  }
}

// function sorthalf(arr) {
//   let mid = Math.ceil(arr.length / 2);
//   for (let i = 0; i < mid; i++) {
//     for (let j = 0; j < mid; j++) {
//       if (arr[j] > arr[j + 1]) {
//         let temp = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = temp;
//       }
//     }
//   }
//   for (let i = mid; i < arr.length - 1; i++) {
//     for (let j = mid; j < arr.length - 1; j++) {
//       if (arr[j] < arr[j + 1]) {
//         let temp = arr[j + 1];
//         arr[j + 1] = arr[j];
//         arr[j] = temp;
//       }
//     }
//   }
//   return arr;
// }

// console.log(sorthalf([1, 7, 8, 2, 5, 4, 21, 90, 52]));

function sorthalf(arr) {
  let mid = Math.floor(arr.length / 2);

  let first = arr.slice(0, mid).sort((a, b) => a - b);
  let middle = arr[mid];
  let second = arr.slice(mid + 1).sort((a, b) => b - a);

  if (arr.length % 2 !== 0) {
    return [...first, ...second, middle];
  } else {
    return [...first, ...second];
  }
}

console.log(sorthalf([2, 6, 3, 1, 9, 8, 5]));
