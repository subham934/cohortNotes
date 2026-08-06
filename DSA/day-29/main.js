// =====================================
// Matrix diagonal Sum (This was solved by me)
// =====================================

// let arr = new Array(3);
// let num = 0;
// let sum = 0;
// for (let i = 0; i < arr.length; i++) {
//   arr[i] = new Array(3);
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     num = num + 1;
//     arr[i][j] = num;
//   }
// }

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 0; j < arr[i].length; j++) {
//     if (i == j) {
//       sum += arr[i][j];
//     } else if (Math.abs(j - i) === 2) {
//       sum += arr[i][j];
//     }
//   }
// }

// console.log(sum);

// console.log(arr);

// =====================================
// Matrix diagonal Sum
// =====================================

// function diagonalSum(mat) {
//   let sum = 0;
//   for (let i = 0; i < mat.length; i++) {
//     for (let j = 0; j < mat[i].length; j++) {
//       if (i == j || i + j == mat[i].length - 1) {
//         sum += mat[i][j];
//       }
//     }
//   }
//   return sum;
// }

// =====================================
// transpose Matrix (for n*n array)
// =====================================

// var transpose = function(matrix) {
//     let tran = [];
//     for(let i = 0; i<matrix.length; i++){
//         tran[i] = [];
//     }
//     for(let i = 0; i<matrix.length; i++){
//         for(let j = 0; j<matrix[i].length; j++){
//             tran[j][i] = matrix[i][j];
//         }
//     }
//     return tran
// };

// console.log(transpose([[1,2,3], [4,5,6], [7,8,9]]));

// =====================================
// transpose Matrix
// =====================================

// var transpose = function(matrix){
//     let row = matrix.length;
//     let col = matrix[0].length;
//     let arr = new Array(col)

//     for(let i = 0; i<arr.length; i++){
//         arr[i] = new Array(row)
//     }

//     for(let i = 0; i<matrix.length; i++){
//         for(let j = 0; j<matrix[i].length; j++){
//             arr[j][i] = matrix[i][j]
//         }
//     }
//     return arr;
// }

// console.log(transpose([[1,2,3], [4,5,6], [7,8,9]]));

// =====================================
// flipAndInvertImage
// =====================================

// var flipAndInvertImage = function (image) {
//   for (let i = 0; i < image.length; i++) {
//     let arr = image[i];
//     let k = 0;
//     let j = arr.length - 1;
//     while (k < j) {
//       let temp = arr[k];
//       arr[k] = arr[j];
//       arr[j] = temp;
//       k++;
//       j--;
//     }
//   }

//   for (let i = 0; i < image.length; i++) {
//     for (let j = 0; j < image[i].length; j++) {
//       image[i][j] = image[i][j] == 1 ? 0 : 1;
//     }
//   }
//   return image;
// };

// console.log(flipAndInvertImage([[1, 1, 0], [1, 0, 1], [0, 0, 0]]));

// =====================================
// Rotate Image
// =====================================

// var rotate = function (matrix) {
//   for (let i = 0; i < matrix.length; i++) {
//     for (let j = i; j < matrix.length; j++) {
//       let temp = matrix[i][j];
//       matrix[i][j] = matrix[j][i];
//       matrix[j][i] = temp;
//     }
//   }

//   console.log(matrix);

//   for (let i = 0; i < matrix.length; i++) {
//     let arr = matrix[i];
//     let k = 0;
//     let j = arr.length - 1;

//     while (j > k) {
//       let temp = arr[j];
//       arr[j] = arr[k];
//       arr[k] = temp;
//       j--;
//       k++;
//     }
//   }

//   return matrix;
// };

// console.log(
//   rotate([
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//   ]),
// );


// =====================================
// Spiral Matrix
// =====================================

//  var spiralOrder = function(matrix) {
//   let row = matrix.length;
//   let col = matrix[0].length;
//   let arr = [];

//   let top = 0;
//   let bottom = row - 1;
//   let left = 0;
//   let right = col - 1;

//   while (top <= bottom && left <= right) {

//     // ➡️ left → right
//     for (let j = left; j <= right; j++) {
//       arr.push(matrix[top][j]);
//     }
//     top++;

//     // ⬇️ top → bottom
//     for (let i = top; i <= bottom; i++) {
//       arr.push(matrix[i][right]);
//     }
//     right--;

//     // ⬅️ right → left
//     if (top <= bottom) {
//       for (let j = right; j >= left; j--) {
//         arr.push(matrix[bottom][j]);
//       }
//       bottom--;
//     }

//     // ⬆️ bottom → top
//     if (left <= right) {
//       for (let i = bottom; i >= top; i--) {
//         arr.push(matrix[i][left]);
//       }
//       left++;
//     }
//   }

//   return arr;
// };

// console.log(
//   spiralOrder([
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//   ]),
// );

// =====================================
//  73. Set Matrix Zeroes
// =====================================
