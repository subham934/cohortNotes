// promises
// async await
// setTimeout , setInterval

// promises =>ek kaam jaake karo => pending state
// ho jeyega => resolved
// nahi hoga => reject

// ===========================

// const prm = new Promise((resolve, reject)=>{
//     setTimeout(() => {
//         resolve("Hello")
//     }, 3000);
// })

// prm.then((e)=>console.log(e))
// .catch(err => console.log(err))

// ===============================

// const orderFood = new Promise(function (resolve, reject) {
//   let restaurantIsOpen = true;

//   if (restaurantIsOpen) {
//     resolve("🍕 Food delivered successfully");
//   } else {
//     reject("❌ Restaurant is closed");
//   }
// });

// orderFood
//   .then(function (message) {
//     console.log(message);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// ===============================

// let pro = new Promise((res, rej)=>{
//     setTimeout(() => {
//         // res("Promised resovled")
//         rej('Promise rejected')
//     }, 3000);
// })

// pro.then(function(res){
//     console.log(res)
// }).catch((err)=>{
//     console.error(err)
// })

// ===============================

// fetch(`https://randomuser.me/api/`)
//   .then(function (notReadableData) {
//     return notReadableData.json();
//   })
//   .then((asliData) => {
//     console.log(asliData.results[0].name.first);
//   });

// fetch se kisi bhi url pe ja sakte hai
// fatch ka data readable nahi hota
// use json banake readable karte hai
// iske baad jo data milta hai, wo readable hota hai

// fetch("https://randomuser.me/api")
//   .then((data) => {
//     return data.json();
//   })
//   .then((data) => {
//     console.log(data.results[0].name.first, data.results[0].name.last);
//   })
//   .catch((err) => console.log(err));

// ===============================
// async await
// promise pe kaam karta hai

// let prm = new Promise((resolve, reject)=>{
//   setTimeout(() => {
//     resolve('Promise Resolved')
//   }, 3000);
// })

// // console.log(prm);

// async function handlePromise() {
//   try {
//     const result = await prm;   // waits here for 3 seconds
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

// handlePromise();

// -------------------------------

// function getNum() {
//   return  new Promise((resolve, reject) => {
//     setTimeout(() => {
//       let num = Math.floor(Math.random() * 10);
//       if (num < 5) {
//         resolve("The number is small");
//       } else {
//         reject("The number is not small");
//       }
//     }, 3000);
//   });
// }

// async function abc() {
//   let v = await getNum();
//   console.log(v);
// }

// abc()

// -------------------------------

// let prm = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     let num = Math.floor(Math.random() * 10);
//     if (num < 5) {
//       resolve("The number is small");
//     } else {
//       reject("The number is not small");
//     }
//   }, 3000);
// });

// console.log(prm);

// async function handlePromise() {
//   try {
//     const result = await prm; // waits here for 3 seconds
//     console.log(result);
//   } catch (error) {
//     console.warn(error);
//   }
// }

// handlePromise();
