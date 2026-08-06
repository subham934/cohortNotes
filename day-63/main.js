// // let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8d0fa124cd25319dc8059ae773a33b2c`

// async function getWeather(city) {
//   try {
//     let apiKey = `8d0fa124cd25319dc8059ae773a33b2c`;

//     let raw = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
//     );

//     if (!raw.ok) {
//       throw new Error("City not found , try something else");
//     }else{
//         let data = await raw.json()
//         console.log(data);

//         if(data.main.temp<0){
//             console.warn("Too Cold out there...and the temperature is ", data.main.temp);

//         }else if(data.main.temp>40){
//             console.warn("Too Hot out there...and the temperature is ", data.main.temp);

//         }
//         else{
//             console.log(data);

//         }
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// getWeather("leh")

// -----------------------------------

// const users = [
//   "tyson.dev.nexus@example.com",
//   "vibrant.coder.77@fastmail.net",
//   "alpha.build.solutions@protonmail.com",
// ];

// function sendEmail(email) {
//   return new Promise((resolve, reject) => {
//     let time = Math.floor(Math.random() * 5);

//     setTimeout(() => {
//       let probability = Math.floor(Math.random() * 10);
//       if (probability <= 5) {
//         resolve("Email Successfully sent.");
//       } else {
//         reject("Email not sent.");
//       }
//     }, time * 1000);
//   });
// }

// // sendEmail("harsh@mail.com")
// //   .then(function (data) {
// //     console.log(data);
// //   })
// //   .catch((err) => {
// //     console.warn(err);
// //   });



// async function sendEmails(userlist){
//     let allResponses = userlist.map((elem)=>{
//         return sendEmail(elem)
//         .then(function(data){
//             return data;
//         })
//         .catch(function(err){
//             return err;
//         })
//     })
//     let ans = await Promise.all(allResponses)

//     ans.forEach((status, index)=>{
//         console.log(`${status}`);
//     })
// }
// sendEmails(users)

// ------------------------

const users = [
  "tyson.dev.nexus@example.com",
  "vibrant.coder.77@fastmail.net",
  "alpha.build.solutions@protonmail.com",
];

function sendEmail(email) {
  return new Promise((resolve, reject) => {
    let time = Math.floor(Math.random() * 5);
    setTimeout(() => {
      let probability = Math.ceil(Math.random() * 10);
      if (probability <= 5) {
        resolve("Email sent successfully.");
      } else {
        reject("Email not sent!!");
      }
    }, time * 1000);
  });
}


async function sendEmails(userlist) {
  let allResponses = userlist.map(function(email){
     return sendEmail(email)
      .then(function (data) {
        return data;
      })
      .catch(function (err) {
        return err
      });
  });
  let ans = await Promise.all(allResponses)
  ans.forEach(function(status){
    console.log(`${status}`);
  })
  
}

sendEmails(users);


