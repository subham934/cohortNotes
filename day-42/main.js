//DOM - Document Object Model
// Frontend ki JS
// DOM - 4 pillers===
// - selection of an element,
// - changing HTML,
// - changing CSS,
// - Event Listener

// // - selection of an element,

// var h1 = document.querySelector('h1')

// console.log(h1);

// // - changing HTML,

// h1.textContent = "I am Batman"

// // - changing CSS,
// h1.style.color = 'pink'
// h1.style.textTransform = 'uppercase'

// - Event Listener

// let box = document.querySelector('#box')
// var h1 = document.querySelector('h1')

// box.innerHTML = 'hey hey'

// h1.addEventListener('click', ()=>{
//     h1.style.color = 'red'
// })

// box.style.background = 'gold'

// let bulb = document.querySelector("#bulb")
// let btn = document.querySelector("button")
// let flag = 0;

// btn.addEventListener("click", function(){
//     if(flag == 0){
//         bulb.style.backgroundColor = 'yellow'
//         console.log("clicked");
//         flag = 1
//         btn.innerHTML = "OFF"
//     }else{
//         bulb.style.backgroundColor = 'transparent'
//         console.log("again clicked");
//         flag = 0
//         btn.innerHTML = "ON"
//     }
// })

// let h1 = document.querySelectorAll('h1')

// // console.log(h1);

// h1.forEach((e)=>{
//     console.log(e);
// })

// 5 projects with DOM

// 1. add friends feature with same button

// let istatus = document.querySelector("h5");

// var add = document.querySelector("#add");
// var flag = 0;

// add.addEventListener("click", () => {
//   if (flag === 0) {
//     istatus.innerHTML = "Friends";
//     istatus.style.color = "green";
//     add.innerHTML = 'Remove Friend'
//     flag = 1;
//   } else {
//     istatus.innerHTML = "Stranger";
//     istatus.style.color = "red";
//     flag = 0;
//     add.innerHTML = 'Add Friend'
//   }
// });

// ==================================
// 2. insta love btn

// var container = document.querySelector("#container");

// var love = document.querySelector("i");

// container.addEventListener("dblclick", () => {
//   love.style.transform = "translate(-50%, -50%) scale(1)";
//   love.style.opacity = 1;
//   setTimeout(() => {
//     love.style.transform = "translate(-50%, -50%) scale(0)";
//     love.style.opacity = 0;
//   }, 800);
// });

// ==================================

// 3. custom cursor

// var main = document.querySelector('#main');
// var crsr = document.querySelector(".cursor")

// main.addEventListener('mousemove',(e)=>{
// crsr.style.left = e.x+'px'
// crsr.style.top = e.y+'px'
// })

// ==================================

// 4. multiple image hovering animation

var elem = document.querySelectorAll(".elem");

elem.forEach((val)=>{
    val.addEventListener('mouseenter',()=>{
        val.childNodes[3].style.opacity= 1;   
    })

    val.addEventListener('mouseleave',()=>{
        val.childNodes[3].style.opacity= 0;    
    })
    val.addEventListener('mousemove',(dets)=>{
        val.childNodes[3].style.left= dets.x+'px';
        val.childNodes[3].style.top= dets.y+'px';
        
    })
})

// ==================================

// 5. insta story feature

// ==================================
