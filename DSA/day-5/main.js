// Conditional Statement
let prompt = require("prompt-sync")();

// let age = +prompt("Enter Your Age ");
// console.log(age);

// if (age >= 18) {
//   console.log("valid voter!");
// }else{
//     console.log("Invalid Voter!!");

// }

// ===============================

// let marks = +prompt('Enter Your Marks ')
// if(marks>85 && marks<=100) console.log('Excellent');
// else if(marks>80 && marks<= 85) console.log("Very Good");
// else if (marks>70 && marks<= 80) console.log("Good");
// else console.log("Fair");

// ===============================

// Accept two numbers and print the greatest betweeen them

// ===============================

// accept an integer and check whether it is an even number or odd

// let n = Number(prompt("Enter a Number "))

// if(n%2 == 0) console.log('Given number is even number');
// else console.log('given number is odd number');

// ===============================

// accept name and age from the user. check if the user is a valid voter or not.

// ===============================

// accept three numbers and print the greatest among them

// let a = +prompt('Enter a ')
// let b = +prompt('Enter b ')
// let c = +prompt('Enter c ')

// if(a>b && a>c){
//     console.log(`${a} is the largest number.`);

// }else if(b>a && b>c) {
//     console.log(`${b} is the biggest number.`);
// }else{
//     console.log(`${c} is the greatest number.`);

// }

// ===============================

// accept a year and check if its a leap year or not

// let year = Number(prompt("Enter a year "));
// if (year % 4 == 0 && year % 100 != 0) {
//   console.log("leap year");
// } else if (year % 400 == 0) {
//   console.log("leap year");
// } else {
//   console.log("Not a leap year");
// }

// ===============================
// let amount = +prompt("Enter Amount: ")

// if(amount>0 && amount<=5000){
//     console.log("Payable Amount: ", amount);

// }else if(amount>5000 && amount<=7000){
//     let discount = (5*amount)/100
//     discount = discount.toFixed(2)
//     let payableAmount = amount - discount;
//     payableAmount = payableAmount.toFixed(2);
//     console.log("Payable Amount: ", payableAmount);
// }
// else if(amount>7000 && amount<=9000){
//     let discount = (10*amount)/100
//     discount = discount.toFixed(2)
//     let payableAmount = amount - discount;
//     payableAmount = payableAmount.toFixed(2);
//     console.log("Payable Amount: ", payableAmount);
// }
// else{
//     let discount = (20*amount)/100
//     discount = discount.toFixed(2)
//     let payableAmount = amount - discount;
//     payableAmount = payableAmount.toFixed(2);
//     console.log("Payable Amount: ", payableAmount);
// }

// ============================

// let amount = +prompt("Enter Amount: ")

// let dis = 0
// if(amount>0 && amount<= 5000){
//     dis=0;
// }else if(amount>5000 && amount<=7000){
//     dis=5;
// }else if(amount>7000 && amount<=9000){
//     dis=10;
// }else{
//     dis=20;
// }

// console.log(`Payable Amount: ` + (amount - (dis*amount)/100));

// ============================

// upto 100-unit = ₹4.2/unit
// upto 100-200 unit = ₹6/unit
// upto 201-400 unit = ₹8/unit
// more then 400 unit = ₹13/unit

// let enterUnit = +prompt('Enter Current Usage: ')

// if(enterUnit<=100){
//     console.log(`Total Amount : ${enterUnit*4.2}`);
// }else if(enterUnit>=101 && enterUnit<=200){
//     console.log(`Total Amount : ${(100*4.2) + (enterUnit-100)*6}`);
// }else if(enterUnit>=201 && enterUnit<=400){
//     console.log(`Total Amount : ${(100*4.2) + (100*6)+ (enterUnit-100)*8}`);
// }else{
//     console.log(`Total Amount : ${(100*4.2) + (100*6)+ (200*8)+ (enterUnit-400)*13}`);
// }

// ###################

// let unit = +prompt("Enter Unit: ");
// let amount = 0;

// if (unit > 400) {
//   amount = (unit - 400) * 13;
//   unit = 400;
// }
// if (unit > 200 && unit <= 400) {
//   amount = amount + (unit - 200) * 8;
//   unit = 200;
// }
// if (unit > 100 && unit <= 200) {
//   amount = amount + (unit - 100) * 6;
//   unit = 100;
// }

// amount = amount + unit * 4.2;
// console.log(amount);

// ================================

// Counting the numver of days in a given month of a year

// let month = Number(prompt("Enter a Month: "));
// let year = Number(prompt("Enter a Year: "));
// let day = 0;

// if (month == 2) {
//   if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
//     day = 29;
//   } else {
//     day = 28;
//   }
// } else if (
//   month == 1 ||
//   month == 3 ||
//   month == 5 ||
//   month == 7 ||
//   month == 8 ||
//   month == 10 ||
//   month == 12
// ) {
//   day = 31;
// } else {
//   day = 30;
// }

// console.log(day);


let x = 0
if(x){
    console.log('Truthy');
    
}else{
    console.log("falsy");
    
}