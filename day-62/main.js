// Introduction to Error handling
// What is error - jab aap koi code likhte ho aur koi dikkat aah gayi , to usko kehte hai error



// =============================


// common types of errors in JS - [`syntex error`, 'runtime error', 'logical errors']
// syntex error= code main likhte waqt galti kar di
//Eg: leht a = 12;

// ------------------------

// Runtime Error: jab code chalega tab error dega
// code  likhte waqt error nahi hai chalte waqt error hai
// Eg:
// function abc(){
//     let a = 2;
//     console.log(a.name);
//     console.log(a.name.first);
// }
// abc()

// ------------------------
// Logical error:  aapke code ko kuch karna chahiye tha , par wo kar kuch aur raha hai


// function add(a,b){
//     return a - b;
// }
// console.log(add(1,2));


// ------------------------

// =============================

// Understanding the error object - [message, name, stack]

// try{
//     let a = 12;
//     console.log(a.age.name);
// }catch(err){
//     console.log(err.message);
//     console.log(err.name);
//     console.log(err.stack);
// }


// =============================
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

// ------------------------------

// try {
//     let a = 12;
//     console.log(a.name.title);
    
// } catch (error) {
//     console.error(new Error('Something went wrong from our side, please wait for sometime!'));
// }

// =============================

// window ka feature

