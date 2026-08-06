// function instagramParJaaoDataLaoo(username, cb){
//     setTimeout(() => {
//         cb(username)
//     }, 2000);
// }

// instagramParJaaoDataLaoo('harsh', function(data){
//     console.log(data);
// })

// ==================================

// function callFromInsta(username, cb){
//     console.log(cb(username));
// }
// callFromInsta('Vijay Dinanath Chauhan', function(data){
//     return data;
// })

// ==================================

// function afterDelay(time, callback){
//     setTimeout(callback, time);
// }

// afterDelay(5000, function(){
//     console.log("Callback Function Executed!!!");

// })

// ====================================

// function getUser(username, cb){
//     console.log(username);
//     setTimeout(() => {
//         cb({ id: 1, username: "harsh" });
//     }, 3000);

// }

// function getUserPosts(id, cb){
//     console.log(id);
//     setTimeout(() => {
//         cb(["Post 1", "Post 2", "Post 3"]);
//     }, 7000);
// }

// getUser("Subham", function(data){
//     console.log(data);
//     console.log(data.id);
//     console.log(data.username);

//     getUserPosts(data.id, function(data){
//         console.log(data);

//     })
// })

// ====================================

// function instagramParJaaoDataLaoo(username, cb){
//     setTimeout(() => {
//         cb(username);
//         console.log(username);
//     }, 3000);
// }

// function metaPeJaaoDataLaao(uniqueNum, cb){
//     setTimeout(() => {
//         cb(uniqueNum)
//     }, 1000);
// }

// instagramParJaaoDataLaoo('Jacob&Co.', function(){
//     metaPeJaaoDataLaao({id: 23391, username: "Richard Mille"}, function(data){
//         console.log(data.id);
//         console.log(data.id - 1);

//     })
// })

// instagramParJaaoDataLaoo({uniqueNum: 68329, username: "Rolex"}, function(data){
//     metaPeJaaoDataLaao(data.uniqueNum, function(data){
//         console.log(data);
//     })
// })

// ====================================

// function instagramParJaaoDataLaoo(username, cb){
//     setTimeout(() => {
//         console.log(username);
//         cb({ username: "harsh", uniqueNum: 1224 });
//     }, 3000);
// }

// function metaPeJaaoDataLaao(uniqueNum, cb){
//     setTimeout(() => {
//         console.log(uniqueNum);

//         cb(['num1', 'num2'])
//     }, 1000);
// }

// instagramParJaaoDataLaoo('Harshit Gupta', function(data){
//     metaPeJaaoDataLaao(data.uniqueNum, function(nums){
//         console.log(nums[0]);
//         console.log(nums[1]);
//     })

// })
// ====================================

// function loginUser(username, cb) {
//   console.log("Logging in user...");
//   console.log("The user is : ", username);

//   setTimeout(() => {
//     cb({ username: "harsh", uniqueNum: 1224 });
//   }, 3000);
// }

// function fetchPermissions(id, cb) {
//   console.log("fetching permissions...");
//   console.log("The user's id is : ", id);

//   setTimeout(() => {
//     cb(["read", "write", "delete"]);
//   }, 2000);
// }

// function loadDashboard(permissions, cb) {
//     console.log("You have permission to", permissions[0], permissions[1], "and", permissions[2]);
//   console.log("loading dashboard...");
//   setTimeout(function () {
//     cb();
//   }, 2000);
// }

// loginUser('harsh', function(data){
//     fetchPermissions(data.uniqueNum, function(permissions){
//         loadDashboard([permissions[0], permissions[1], permissions[2]], function(){
//             console.log("dashboard loaded");
//         })
//     })
// })

// const prm = new Promise((resolve, reject)=>{
//     setTimeout(() => {
//         // resolve("Hello Mercedes")
//         reject("Hello Mercedes, its a fault car")
//     }, 3000);
// })

// prm.then((e)=>console.log(e))
// .catch(err => console.error(err))

// const orderFood = new Promise(function (resolve, reject) {
//       let restaurantIsOpen = true;
//     if(restaurantIsOpen){
//         resolve("🍕 Food delivered successfully")
//     }else
//     reject("❌ Restaurant is closed");
// })

// orderFood.then((e)=>console.log(e))
// .catch(err => console.error(err))

// let promise = new Promise((res, rej)=>{
//     setTimeout(() => {
//         res("Promise Resolved")
//     }, 3000);
// })

// promise.then(function(res){
//     console.log(res);
// }).catch(function(err){
//     console.error(err);
// }).finally(function(){
//     console.log("Finally");
// })

// fetch("https://randomuser.me/api/")
//   .then((nonreadableData) => nonreadableData.json())
//   .then((readableData) => {
//     console.log(
//       readableData.results[0].name.first,
//       readableData.results[0].name.last,
//     );
//   })
//   .catch((err) => console.error(err));

// ===============================

// let prm = new Promise((resolve, reject)=>{
//     setTimeout(() => {
//         resolve("Promise Resolved");
//     }, 3000);
// })

// // console.log(prm);

// async function handlePromise(){
//     try{
//         const result = await prm;
//         console.log(result);

//     }catch(error){
//         console.error(error);
//     }
// }

// handlePromise();

// ===============================

// function getNum() {
//   return new Promise((resolve, reject) => {
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

// async function abc(){
//     let v = await getNum()
//     console.log(v);
// }

// abc()

// ===============================

// let prm = new Promise((resolve, reject)=>{
//     setTimeout(() => {
//         let num = Math.floor(Math.random() * 10);

//         if(num < 5){
//             resolve("The number is small")
//         }else{
//             reject("The number is not small")
//         }
//     }, 5000);
// })

// // console.log(prm);

// async function handlePromise(){
//     try{
//         const result = await prm;
//         console.log(result);
//     }catch(err){
//         console.error(err);

//     }
// }

// handlePromise()

// ===============================

// try{
//     let a = 12;
//     console.log(a.age.name);
// }catch(err){
//     console.log(err.message);
//     console.log(err.name);
//     console.log(err.stack);
// }

// ===============================

// Handling exceptions using `try-catch` , `try-catch-finally`

// try{
//     let a = 12;
//     console.log(a.age.name);
// }catch(err){
//     console.log(err);
// }finally{
//     console.log('ola amigo');
// }

// =============================

// how to thow error in JS

// try {
//     let a = 12;
//     console.log(a.name.title);

// } catch (error) {
//     throw new Error('Something went wrong from our side, please wait for sometime!')
// }

// =============================
// try {
//   console.log("Opening file...");
//   throw new Error("File corrupted");
// } catch (error) {
//   console.log("Error:", error.message);
// } finally {
//   console.log("Closing file...");
// }

// =============================

// function divide(a, b) {
//   if (b === 0) {
//     throw new Error("Cannot divide by zero");
//   }
//   return a / b;
// }

// try {
//   console.log(divide(10, 0));
// } catch (error) {
//   console.log(error.message);
// }

// =============================
// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "Validation Error";
//   }
// }

// function registerUser(age) {
//   if (age < 18) {
//     throw new ValidationError("User must be 18+");
//   }
//   return "User registered";
// }

// try {
//   registerUser(15);
// } catch (err) {
//   console.log(err.name);    // ValidationError
//   console.log(err.message); // User must be 18+
// }

// =============================

// async function getWeather(city) {
//   try {
//     let apiKey = `8d0fa124cd25319dc8059ae773a33b2c`;
//     let raw = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
//     );

//     if (!raw.ok) {
//       throw new Error("City not found , try something else");
//     } else {
//       let data = await raw.json();
//       //   console.log(data);

//       if (data.main.temp < 0) {
//         console.warn(
//           "Too Cold out there...and the temperature is ",
//           data.main.temp,
//         );
//       } else if (data.main.temp > 313.15) {
//         console.warn(
//           "Too Hot out there...and the temperature is ",
//           data.main.temp,
//         );
//       } else {
//         console.log(
//           `You can visit ${city}, the tempearature is ${data.main.temp}`,
//         );
//       }
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// getWeather("jaipur");

// =============================

const users = [
  "tyson.dev.nexus@example.com",
  "vibrant.coder.77@fastmail.net",
  "alpha.build.solutions@protonmail.com",
];

function sendEmail(email) {
  return new Promise((resolve, reject) => {
    let time = Math.floor(Math.random() * 5);

    setTimeout(() => {
      let probability = Math.floor(Math.random() * 10);
      if (probability <= 5) {
        resolve("Email sent successfully");
      } else {
        reject("Emails not sent...");
      }
    }, time * 1000);
  });
}

async function sendEmails(userlist) {
  let allResponse = userlist.map(function (emails) {
    return sendEmail(emails)
      .then(function (data) {
        return data;
      })
      .catch(function (err) {
        return err;
      });
  });

  let ans = await Promise.all(allResponse);
  console.log(ans);
  
}

sendEmails(users);

// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
// =============================
