// let h1 = document.querySelector("h1");

// h1.style.color = "gold";

// h1.innerHTML = "I'm Batman";

// h1.style.background = "green";

// var box = document.querySelector("#box")

// box.innerHTML = "Hi there!!!"

// box.style.backgroundColor = "royalblue"


// h1.addEventListener('dblclick', (dets)=>{
//     h1.style.textTransform = 'uppercase'
// })




var h1 = document.querySelector('h1')
var btn = document.querySelector('.btn')

btn.addEventListener('click', function(){
    h1.innerHTML = "I'm a Zombie"
    h1.style.color = "gold"
    h1.style.fontSize = "60px"
})