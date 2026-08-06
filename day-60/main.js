// cb = ek function hota hai
// jab kaam ho jaye tab chalta hai cb

// function instagramParJaaoDataLaoo(username, cb){
//     // logic
//     cb(username)
// }

// instagramParJaaoDataLaoo('harsh', function(data){
//     console.log(data);
// })

// ==================================

// function instagramParJaaoDataLaoo(username, cb) {
//   // logic
//   setTimeout(() => {
//     cb({ id: 1, username: "harsh", age: 27 });
//   }, 2000);
// }

// instagramParJaaoDataLaoo("harsh", function (data) {
//   console.log(data);
// });

// ==================================

// ## Exercise 1 — Very Easy (Warming up)

// **Task (Hindi):** Ek function banao `afterDelay`

// **Requirements:**
// - Ye function do cheezein lega:
//   1. `time` (milliseconds)
//   2. `callback` function
// - Given `time` ke baad `callback` call kare
// - Callback ke andar `"Callback executed"` print hona chahiye

// **Use case:**
// > “2 second baad ek kaam karna hai”

// **Goal:**
// - Samajhna ki callback delay ke baad kaise execute hota hai
// - Ye `setTimeout` + callback connection hai

// Ans:

// function afterDelay(time, cb){
//     setTimeout(() => {
//         cb();
//     }, time);
// }

// afterDelay(3000, function(){
//     console.log('Callback executed');
// })

// ==================================
// ## Exercise 2 — Intermediate (Data flow)
// ==================================

// **Task (Hindi):** Ek function banao `getUser`

// **Requirements:**
// - `getUser` `username` lega
// - 1 second ke baad `callback` ko ek object de:
//   - `id`
//   - `username`

// **Then:**
// - Callback ke andar ek aur function call karo `getUserPosts`

// **`getUserPosts` requirements:**
// - `userId` lega
// - 1 second ke baad `callback` ko `posts` ka array de

// **Final output:**
// - User ka `username` print ho
// - Fir uske `posts` print ho

// **Goal:**
// - Samajhna ki ek async ka result next async ko kaise milta hai
// - Callback chaining practice

// -----------------------------

// function getUser(username, cb) {
//   setTimeout(() => {
//     cb({ id: 1, username: "harsh" });
//   }, 1000);
// }

// function getUserPosts(id, cb) {
//   setTimeout(() => {
//     cb(["hello", "good day", "fack you"]);
//   }, 2000);
// }

// getUser("harsh", function (data) {
//   getUserPosts(data.id, function (allposts) {
//     console.log(data.username, allposts);
//   });
// });

// -----------------------------

// function instagramParJaaoDataLaoo(username, cb) {
//   setTimeout(() => {
//     cb(username);
//     console.log(username);
//   }, 3000);
// }

// function metaPeJaaoDataLaao(uniqueNum, cb) {
//   setTimeout(() => {
//     cb(uniqueNum);
//   }, 4000);
// }

// instagramParJaaoDataLaoo(
//   { uniqueNum: 1224, username: "harsh" },
//   function (data) {
//     metaPeJaaoDataLaao(data.uniqueNum, function (uniqueNum) {
//       console.log(uniqueNum+55);
//     });
//   }
// );

// -----------------------------

// function instagramParJaaoDataLaoo(username, cb) {
//   setTimeout(() => {
//     cb({ username: "harsh", uniqueNum: 1224 });
//   }, 3000);
// }

// function metaPeJaaoDataLaao(uniqueNum, cb) {
//   setTimeout(() => {
//     cb(["img1", "img2"]);
//   }, 4000);
// }

// instagramParJaaoDataLaoo("harsh", function (data) {
//   metaPeJaaoDataLaao(data.uniqueNum, function (images) {
//     console.log(images);
//   });
// });

// ======================================

// ## Exercise 3 — Intermediate (Callback dependency — thoda painful)

// **Task (Hindi):** Teen functions banao:

// 1. `loginUser`
//    - 1 second baad callback ko `user` object de
// 2. `fetchPermissions`
//    - `userId` lega
//    - 1 second baad callback ko `permissions` array de
// 3. `loadDashboard`
//    - `permissions` lega
//    - 1 second baad callback ko `"Dashboard loaded"` bole

// **Flow:**
// - Pehle `loginUser`
// - Uske andar `fetchPermissions`
// - Uske andar `loadDashboard`
// - Final output console mein print ho

// **Goal:**
// - Callback nesting ko feel karna
// - Yehi structure baad mein callback hell banta hai

// ---

// ### Notes
// - Practice in plain JavaScript using `setTimeout` and callbacks to understand the flow before converting to Promises/async–await.
// Displaying Day 60 Question Sheet.md.

// ======================================

// function loginUser(username, cb) {
//   console.log("logging in user...");

//   setTimeout(() => {
//     cb({ id: 1212, username: "harsh" });
//   }, 1000);
// }

// function fetchPermissions(id, cb) {
//   console.log("fetching permissions...");
//   setTimeout(() => {
//     cb(["read", "write", "delete"]);
//   }, 2000);
// }

// function loadDashboard(permissions, cb) {
//   console.log("loading dashboard...");
//   setTimeout(function () {
//     cb();
//   }, 2000);
// }

// loginUser("harsh", function (userdata) {
//   fetchPermissions(userdata.id, function (permissions) {
//     loadDashboard(permissions, function () {
//       console.log("dashboard loaded");
//     });
//   });
// });


// ======================================


