// 18. Ask user 5 numbers. Count how many are positive
// Use loop + condition + counter.

// let positiveCount = 0;

// for(i=1; i<=5; i++){
//     let num = Number(prompt(`Enter Number ${i}`));

//     if(num > 0){
//         positiveCount++;
//     }
// }

// console.log(`Total Positive Numbers : ${positiveCount}`);

// ===================================
// // 19. ATM Simulator – Allow 3 withdrawals
// // Start with ₹1000 balance. Ask withdrawal amount 3 times.
// // If enough balance → deduct
// // Else → print “Insufficient balance”

// let balance = 1000;

// for (i = 1; i <= 3; i++) {
//   let withdrawal = +prompt(`Enter ${i} withdrawal amount`);

//   if (balance >= withdrawal) {
//     balance -= withdrawal;
//   } else {
//     console.log("Insufficient balance");
//     break;
//   }
// }

// console.log(`Total amount remaining ${balance}`);
// ##########################

// let balance = 1000;
// let flag = false;
// let counter = 0;

// while (balance > 0 && counter !== 3) {
//   let withdrawal = +prompt(`Kitna paise withdraw karna hai!!!`);
//   counter++;
//   if (withdrawal <= balance) {
//     balance -= withdrawal;
//   }else{
//     flag = true;
//     break;
//   }
// }

// if (flag === true) {
//   console.log("Insufficient Amount");
// }

// console.log(`Total Amount remaining in account ${balance}`);

// ===================================


// do while in JS

// do{

// }
// while()

// if we use while and if together, we can do anything dowhile can

// =====================


// -Recursion in JS

// function abcd(n){
//     if(n===0) return;
//     console.log(n);
//     abcd(n-1)
// }
// abcd(5);

// =====================

// Loop control statements -[break, continue]

// for(i=1; i<10; i++){
//     if(i===5) break;
//     console.log(i);
// }

// for(i=1; i<10; i++){
//     if(i===5) continue;
//     console.log(i);
// }

// ========================
// function()=> aapka code, jo turant nahi chalega, tab chalega jab aap bologe ki ab chalo
// aap us code ko kitni bhi bar chala sakte ho

// function doSomthing(name, age, email){
//     console.log(`Hi, I'm ${name} , i'm ${age} years old and my mail id is ${email}`);
//     console.log(arguments);
    
// }

// doSomthing("harsh", 27, 'harsh28@gmail.com')


// function doSomthing(){
//     console.log(arguments[0]);
//     console.log(arguments[1]);
//     console.log(arguments[2]);
// }

// doSomthing("harsh", 27, 'harsh28@gmail.com')


