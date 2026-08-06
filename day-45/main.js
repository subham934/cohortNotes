// setTimeout() - delay
// setInterval() - controlled loop

// console.log("hello 1");
// console.log("hello 2");

// setTimeout(() => {
//   console.log("hello 3");
// }, 2000);
// console.log("hello 4");



// setTimeout(()=>{
//     console.log('Hello 1');
// }, 5000)

// setTimeout(()=>{
//     console.log('Hello 2');
// }, 2000)

// setTimeout(()=>{
//     console.log('Hello 3');
// }, 4000)



// setTimeout()

// var user = 'Harsh'

// var btn = document.querySelector('button');
// var h1 = document.querySelector("h1")


// btn.addEventListener('click', function(){
//     console.log('Button is clicked');
//     h1.innerHTML = 'changing user...'
//     setTimeout(()=>{
//         h1.innerHTML = `Hello , I'm ${user}`
//     }, 2000)    
// })



// setInterval()

// setInterval(()=>{
//     console.log('Hey from setInterval');
// }, 2000)


// var a = 0;

// setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 500);

// setInterval makes the loop infinite, so to control that we have a method called clearInterval()


// var a = 0;

// var int = setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 100);

// clearInterval(int)


// =========================
// let a = 0;
// var ace = setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 100);

// setTimeout(() => {
//     clearInterval(ace)
// }, 5000);



// =============================


var grow = 0;
var btn = document.querySelector('button');
var h2 = document.querySelector('h2')
var inner = document.querySelector(".inner")

btn.addEventListener('click', ()=>{

    btn.style.pointerEvents= "none"
    var num = 50 + Math.floor(Math.random()*50)


    var download = setInterval(() => {
        grow++;
        h2.innerHTML = grow+"%";
        inner.style.width = grow+"%";
    }, num);

    setTimeout(() => {
        clearInterval(download);
        btn.style.background = 'green'
        btn.innerHTML = 'Downloaded'
        console.log('Downloaded in', num/10, 'seconds');
    }, num*100);
    
})



// What to do?
// make a downloading effect like this.








// # 📘 Day 45 - More on DOM

// ## 🔹 **Synchronous JavaScript**
// Synchronous code executes **line-by-line**.  
// Each task must finish **before the next one starts** — this blocks the single JS thread.

// ###  Simple Example
// ```js
// console.log("Step 1");
// console.log("Step 2");
// console.log("Step 3");
// ```

// ### 📤 Output
// ```
// Step 1
// Step 2
// Step 3
// ```

// 👉 JavaScript executes everything **in order**, without skipping.  


// ---

// ## 🔹 **Asynchronous JavaScript**
// Asynchronous code allows JS to **start a task and continue running** without waiting for it to finish.

// ### ⭐ Key Features
// - Non-blocking  
// - Uses **Event Loop**, **Callback Queue**, **Microtask Queue**  
// - Does not freeze UI  

// ### 🧠 Why Async?
// Real apps need time-consuming tasks like:
// - fetching data  
// - waiting for timers  
// - reading files  
// - animations  
// - user interactions  

// If JS waited synchronously → **UI freezes** 
// So JS uses **asynchronous programming**.

// ### Simple Example
// ```js
// console.log("first");

// setTimeout(() => {
//   console.log("second");
// }, 2000);

// console.log("third");
// ```

// ---

// ## ⏰ **setTimeout()**
// `setTimeout()` schedules code to run **after a delay**, without stopping execution.

// ### Important Points
// - Does *not* pause JavaScript  
// - Uses browser Web APIs  
// - Executes later  

// ### Example
// ```js
// console.log("A");

// setTimeout(() => {
//   console.log("B");
// }, 2000);

// console.log("C");
// ```

// ---

// ## 🔁 **setInterval()**
// `setInterval()` repeatedly executes code after every given interval.

// ### Features
// - Runs again & again  
// - Asynchronous  
// - Must be manually stopped  

// ### Basic Example
// ```js
// setInterval(() => {
//   console.log("Hello every 1 second");
// }, 1000);
// ```

// ⏳ Keeps running forever unless stopped using `clearInterval()`.

// ---

// ## 🛑 **clearInterval()**
// Used to **stop a running interval**.  
// You must pass the interval ID returned by `setInterval()`.

// ### Example: Stop Interval After 5 Seconds
// ```js
// let count = 1;

// const id = setInterval(() => {
//   console.log("Count:", count);
//   count++;
// }, 1000);

// setTimeout(() => {
//   clearInterval(id);
//   console.log("Interval stopped!");
// }, 5000);
// ```

// ### 🟦 Output
// ```
// Count: 1
// Count: 2
// Count: 3
// Count: 4
// Interval stopped!
// ```
// Displaying Day 45 - More on Dom.md.