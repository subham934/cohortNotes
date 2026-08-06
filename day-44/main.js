// Create Element
// append a child

const { createElement } = require("react")

// let btn = document.querySelector(".btn")

// btn.addEventListener("click",()=>{
//     var h1 = document.createElement('h1');
//     h1.innerHTML = "Hello From JS"
//     console.log(h1);
    
// })



// ✅ SOLUTION 1 (BEST & SIMPLE): prepend()
// var h1 = document.createElement("h1");
// h1.innerHTML = "Hello From JS";

// var main = document.querySelector("main");
// main.prepend(h1);

// console.log(main);

// 🔥 What prepend() does

// Inserts the element as the FIRST child.

// ✔ Text appears above the button
// ✔ Inside <main>
// ✔ Clean & readable

// ✅ SOLUTION 2: insertBefore() (classic way)
// var h1 = document.createElement("h1");
// h1.innerHTML = "Hello From JS";

// var main = document.querySelector("main");
// var btn = document.querySelector(".btn");

// main.insertBefore(h1, btn);


// This explicitly says:

// “Insert h1 before button.”

// 🧠 Quick comparison (memorize this)
// Method	Position
// appendChild()	Last
// prepend()	First
// insertBefore()	Before specific element
// 🧾 One-line rule (THIS is the key)

// DOM elements appear in the order they exist inside the parent; use prepend() if you want content above existing elements.



// var div = document.createElement('div'); 

// div.style.height = '100px'
// div.style.width = '100px'
// div.style.backgroundColor = 'crimson'

// var main = document.querySelector('main');

// main.appendChild(div)


// var btn = document.querySelector('button')
// var main = document.querySelector('main')

// btn.addEventListener("click", function(){
//     let h1 = document.createElement("h1")
//     h1.innerHTML="Hello"
//     h1.style.color = 'white'
    
//     main.insertBefore(h1, btn)
// })





// var btn = document.querySelector('.btn')
// var main = document.querySelector('main')

// btn.addEventListener('click', ()=>{
//     var div = document.createElement('div')
//     div.style.height = '50px'
//     div.style.width = '50px'
//     div.style.backgroundColor = 'blue'

//     var x = Math.random()*100
//     var y = Math.random()*100
//     var c1 = Math.round(Math.random()*255)
//     var c2 = Math.round(Math.random()*255)
//     var c3 = Math.round(Math.random()*255)
//     div.style.backgroundColor = `rgb(${c1},${c2}, ${c3})`
//     div.style.position = 'absolute'
//     div.style.top = y+"%"
//     div.style.left = x+"%"
//     main.appendChild(div)
    
// })



// createElement is used to create new element.
// appendChild is used to append it in any parent.


// 1.make main div in html, give it height and width 100%

// 2. make a button and center it. (give it position relative and z-index)

// 3. in js select button and main div and add a addEventListener button

// 4. inside a function create a new Element with the help of createElement method

// 5. if you have successfully created an Element print it on console to check it.

// 6. write innerHTML if you want 

// 7. use appendchild method to add this to main div



// Task: when user click on button create h1 , put randon quote in it (from array ) and give random posittion , rotation , scale, color, and append them to parent