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
// console.log(user1.age);
// console.log(user1.email);
// console.log(user1.address);

// console.log(user2.name);
// console.log(user2.age);
// console.log(user2.email);
// console.log(user2.address);

// class Fan {
//   constructor() {
//     this.brand = "Orient",
//     this.price = 1500,
//     this.length = "1400mm";
//     this.color = "blue";
//   }

//   powerOn() {
//     console.log(`The Fan is turned On`);
//   }
//   powerOff() {
//     console.log(`The Fan is turned Off`);
//   }
// }

// let fan1 = new Fan();
// console.log(fan1);
// console.log(fan1.brand);
// console.log(fan1.price);
// console.log(fan1.length);
// console.log(fan1.color);
// fan1.powerOn();
// fan1.powerOff();

// class Bike{
//     constructor(brand, name, color, price){
//         this.brand = brand;
//         this.name = name;
//         this.color = color;
//         this.price = price;
//     }

//     start(){
//         console.log(`The ${this.brand} ${this.name} is started`);
//     }
//     stop(){
//         console.log(`The ${this.brand} ${this.name} is stopped`);
//     }

// }

// let bike1 = new Bike('Honda', 'CBR', 'red', 100000);
// let bike2 = new Bike("BMW", "F450", "white&blue", 450000)

// console.log(bike1);
// console.log(bike2);

// console.log(bike1.brand);
// console.log(bike1.name);
// console.log(bike1.color);
// console.log(bike1.price);
// bike1.start();
// bike1.stop();

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
// cc1.pack()
// ac1.unpack();
// cc1.unpack()
// =========================================
// class Kitaab {
//   constructor() {
//     this.name = "science";
//     this.price = 1200;
//     this.author = "harsh sharma";
//     this.color = "green";
//   }

//   pannaPalto() {
//     console.log(`Page 5 se naya chapter start hota hai, kitab ka panna palto`);
//   }
//   bookmarkLagao() {
//     console.log(`Kisi bhi page main koi topic aacha lage to bookmark karo`);
//   }
//   padhlo() {
//     console.log(`Ak mahine baad exam hai, aache se padho`);
//   }
// }

// let k1 = new Kitaab();
// console.log(k1);
// console.log(k1.name);
// console.log(k1.color);
// k1.pannaPalto();
// k1.bookmarkLagao();
// k1.padhlo();

// let k2 = new Kitaab('moral', 120, 'harsh sharma', 'white') // this thing wont work as we have already given the name, price, author, color manually, to make it work we have to do as follows:

// =========================================


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


