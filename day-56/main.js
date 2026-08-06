// Advance JS

// till now = avg JS
// from now = industry level JS

// OOPS concepts =================

// jab code chota hota hai, top phir aap kcuh bhi kar sakte ho bina koi guideline follow kiye, and jab code bada ho jata hai, tab role main aata hai guidelines

// code now ==>> objects, classes and functions

// to transform the code to a moduler, scalable, manageable, promising a better code, easy to fix gurantee is done with OOP

// object
// let user1 = {
//   name: "harsh",
//   age: 27,
//   email: "harsh@gmail.com",
//   address: "Tokyo, Japan",
// };

// let user2 = {
//   name: "sarthank",
//   age: 27,
//   email: "sarthank@gmail.com",
//   address: "Kyoto, Japan",
// };

// console.log(user1.name);

// classes are blueprint
// constructor = automatic chalne wala function

// class Remote{
//     constructor(){
//         this.product = 'daikin',
//         this.price = 12300,
//         this.color = 'white';
//     }
//     powerOn(){
//         console.log('the machine is on now.');
//     }
//     powerOff(){
//         console.log('the machine is off now.');
//     }
// }

// let remote = new Remote();
// console.log(remote);

// class Remote{
//     constructor(product, price, color){
//         this.product = product;
//         this.price = price,
//         this.color = color;
//     }
//     powerOn(){
//         console.log('the machine is on now.');
//     }
//     powerOff(){
//         console.log('the machine is off now.');
//     }
// }

// let remote1 = new Remote('Lenovo', 2300, 'grey');
// let remote2 = new Remote('Daikin', 12300, 'white');
// console.log(remote1);
// console.log(remote2);

// to create a blueprint that produce same type of biscuit we write as follow:

// class BiscuitMaker{
//     constructor(){
//         this.name = 'Parle-G';
//         this.price = 5;
//     }
// }

// let biscuit = new BiscuitMaker();
// console.log(biscuit);

// let biscuit2 = new BiscuitMaker();
// console.log(biscuit2);

// let biscuit3 = new BiscuitMaker();
// console.log(biscuit3);

// classes banate hai taki humain har bar ek naya object mil jaaye
// classes object ki factory hai
// har bar new word ke saath class run karoge toh ek naya object milega

// class AlooChat{
//     constructor(){
//         this.price = 55;
//         this.oil = '5ml';
//         this.oilBrand = 'saffola';
//         this.masala = ['dhania', 'pudina', 'mirch']
//     }

//     pack(){
//         console.log('aloo chaat packed');
//     }

//     unpack(){
//         console.log('aloo chaat unpacked');
//     }

// }

// class choleChat{
//     constructor(){
//         this.price = 80;
//         this.oil = '5ml';
//         this.oilBrand = 'saffola';
//         this.masala = ['dhania', 'pudina', 'mirch']
//     }

//     pack(){
//         console.log('choleChat packed');
//     }

//     unpack(){
//         console.log('choleChat unpacked');
//     }

// }

// let ac1 = new AlooChat();
// let cc1 = new choleChat()
// ac1.pack();
// ac1.unpack();
// cc1.pack()

// ===================================

// class Kitaab {
//     constructor(){
//         this.name = "science";
//         this.price = 1200;
//         this.author = 'harsh sharma';
//         this.color = 'green';
//     }

//     pannaPalto(){

//     }
//     bookmarkLagao(){

//     }
//     padhlo(){}

// }

// let k1 = new Kitaab();
// console.log(k1);
// console.log(k1.name);
// console.log(k1.color);

// let k1 = new Kitaab('moral', 120, 'harsh sharma', 'white') // this thing wont work as we have already given the name, price, author, color manually, to make it work we have to do as follows:

// ======================================

// class Kitaab {
//   constructor(name, price, author, color) {
//     this.name = name;
//     this.price = price;
//     this.author = author;
//     this.color = color;
//   }

//   pannaPalto() {}
//   bookmarkLagao() {}
//   padhlo() {}
// }

// let k1 = new Kitaab("moral", 120, "harsh sharma", "white");

// let k2 = new Kitaab("computer science", 890, "gopi bahu", "red");

// let k3 = new Kitaab("constitution", 362, "br ambedkar", "maroon");

// console.log(k1, k2, k3);


// this
// this ka value likhte waqt nahi , chalte waqt decide hoti hai
// this is a keyword that refers to the context in which a function is executed.
// 👉 The value of this depends on how and where the function is called, not where it is written.


// contructor() -> ek function jo automatic chalta hai jaise hi class se naya instance banaya jaata hai

// ==============================
// class Human{
//     constructor(){
//         this.name='abcd';
//         this.age = 22;
        
//     }

//     saansLo(){}
//     khanaKhaao(){}
// }

// let h1 = new Human()
// let h2 = new Human()

// console.log(h1);
// console.log(h2);

// here, both h1 and h2 has both saansLo() and khanaKhaoo() function, we can find those inside "prototype", to do the same this we do the following 
// ==============================

class Human{
    constructor(){
        this.name='abcd';
        this.age = 22;
        
    }
}
Human.prototype.saansLo = function(){
    console.log('hey');
}
Human.prototype.khanaKhaao = function(){
    console.log('hey');
}
let h1 = new Human()
let h2 = new Human()

console.log(h1);
console.log(h2);

// here, what we have done is we have removed the function and put it inside prototype of class Human, that help in sharing memory for the function, so h1 & h2, both wont need to create separate function for themselves, instead they can share the function memory



// In JavaScript, class methods are stored on the prototype, so all instances share the same method reference. This avoids creating duplicate functions for every object, making it memory-efficient. If methods are defined inside the constructor, new function copies are created per instance, which is inefficient.