Stable sort kya hota hai
👉 equal elements ka original order preserve karta hai

Example:

Input:
[(A, 5), (B, 3), (C, 5)]

Sort by number →
[(B, 3), (A, 5), (C, 5)]


Notice:
A before C originally
A still before C after sort


👉 order same → stable sort



Unstable sort
👉 equal elements ka order change ho sakta hai

Possible output:

[(B, 3), (C, 5), (A, 5)]


A aur C swap ho gaye.

Still correct numerically
but original order lost.

Why stability matters
Important when sorting by multiple keys.

Example:

sort by age
then sort by name
If stable → previous sorting preserved.
Databases rely on this.

Real life analogy

Stable sort:

queue maintain karta hai


Unstable sort:

log dhakka maar ke order change kar dete 😄

Common algorithms
Stable

✅ Merge sort
✅ Bubble sort
✅ Insertion sort
✅ TimSort (Python/JS built-in)

Unstable

❌ Quick sort
❌ Heap sort
❌ Selection sort


JavaScript note

Modern JS .sort() is stable
(ES2019+ guarantee)




One-line memory trick

👉 stable = respect history
👉 unstable = forget history


// Stable Sort: A sorting algorithm is said to be stable if it preserves the relative order of equal elements in the sorted output. In other words, if two elements are equal, they will appear in the same order in the sorted output as they do in the input.

// Example of Stable Sort: Consider the following array of objects representing people with their names and ages:

const people = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 30 },
  { name: "David", age: 25 },
  { name: "Eve", age: 35 },
];

// If we sort this array by age using a stable sorting algorithm, the output will be:

const stableSortedPeople = people.sort((a, b) => a.age - b.age);

console.log(stableSortedPeople);
