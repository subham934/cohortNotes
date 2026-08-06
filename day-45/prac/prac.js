
// console.log("hello 1");
// console.log("hello 2");

// setTimeout(() => {
//   console.log("hello 3");
// }, 2000);
// console.log("hello 4");


// setTimeout(()=>{
//     console.log('Hello 1');
// }, 5000)

// setTimeout(()=>{
//     console.log('Hello 2');
// }, 2000)

// setTimeout(()=>{
//     console.log('Hello 3');
// }, 4000)



// setInterval(()=>{
//     console.log('Hey from setInterval');
// }, 2000)


// var a = 0;

// setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 500);



// setInterval makes the loop infinite, so to control that we have a method called clearInterval()


// var a = 0;

// var int = setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 100);

// setTimeout(() => {
//     clearInterval(int);
// }, 5000);


// let a = 0;
// var ace = setInterval(() => {
//     a++;
//     console.log(a);
    
// }, 100);

// setTimeout(() => {
//     clearInterval(ace)
// }, 5000);


var grow = 0;
var btn = document.querySelector('button');
var h2 = document.querySelector('h2')
var inner = document.querySelector(".inner")

btn.addEventListener('click', ()=>{

    btn.style.pointerEvents= "none"
    var num = 50 + Math.floor(Math.random()*50)


    var download = setInterval(() => {
        grow++;
        h2.innerHTML = grow+"%";
        inner.style.width = grow+"%";
    }, num);

    setTimeout(() => {
        clearInterval(download);
        btn.style.background = 'green'
        btn.innerHTML = 'Downloaded'
        console.log('Downloaded in', num/10, 'seconds');
    }, num*100);
    
})

