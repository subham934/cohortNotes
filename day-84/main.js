// console.log("hello");

// for(let i = 0; i<5; i++){
//     console.log(i)
// }

// const catMe = require('cat-me');
// console.log(catMe());

// package.json = JS ka jo code hai, wo kaun sa packages pe depend karta hai wo sare k sare package.json file pe note karo

// =================================

// node_modules folder = if we are to use a package, we need to install that package into our system and that package is stored in node_modules

// Jab tum package install karte ho

// Tab kya hota hai:

// ✅ package download hota hai
// ✅ uske dependencies bhi download hote hain
// ✅ sab node_modules ke andar store hota hai

// =================================

// server = server ak machine hoti hai, jiske paas khud ka ak OS hai, khud ki ak processor hai, khudi ki ak RAM hoti hai, khud ki ak storage hoti hai

// server ak machine hai jisko programm kiya gaya hai ki user jo bhi request karega , uska ak proper response milega

// =================================

// const express = require('express');
// const app = express() // server has been created
// app.listen(3000) // server ko start karta hai

// what is happeing in the above code
// 1. server has been created
// 2. server has been started
// 3. server is listening to port 3000

// =================================

const express = require("express");
const app = express(); // server has been created
app.listen(3000, () => console.log("Server is running on port 3000")); // server ko start karta hai

// what is happeing in the above code
// 1. server has been created
// 2. server has been started
// 3. server is listening to port 3000
