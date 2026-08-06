// JUST look at the notes at main.txt

// const searchInput = document.getElementById("search");

// function debounce(fn, delay) {
//   let timer;

//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, delay);
//   };
// }

// function handleSearch(e) {
//   console.log("Searching for:", e.target.value);
// }

// const debouncedSearch = debounce(handleSearch, 500);

// searchInput.addEventListener("input", debouncedSearch);

// ================================
// throttling

// window.addEventListener("mousemove", function(e){
//     setTimeout(() => {
//         console.log(e.clientX, e.clientY);
//     }, 2000);
// })


// Throttling ensures a function executes only once every X milliseconds, no matter how frequently the event is triggered.


// function throttle(fn, limit) {
//   let lastCall = 0;

//   return function (...args) {
//     const now = Date.now();

//     if (now - lastCall >= limit) {
//       lastCall = now;
//       fn.apply(this, args);
//     }
//   };
// }

// window.addEventListener(
//   "scroll",
//   throttle(() => {
//     console.log("Scrolling...");
//   }, 300)
// );
