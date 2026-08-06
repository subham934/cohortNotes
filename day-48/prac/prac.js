
var chutki = document.querySelector("img");
var msg = document.querySelector("h2 span");
var body = document.body;

chutki.addEventListener("mouseenter", () => {
  msg.innerHTML = "chutki se dur ho jaaa🤬🤬🤬";
  body.style.background = 'red'
});

chutki.addEventListener("mouseleave", () => {
    msg.innerHTML = "Good! Aab dur hi rehna 😤😤";
    body.style.background = '#777'
});



var main = document.querySelector('#main')


// main.addEventListener("mouseenter", function(){
//     console.log("hello");
    
// })

// main.addEventListener("mouseleave", function(){
//     console.log("bye");
    
// })


// main.addEventListener("mousemove", function(){
//     console.log("hii");
    
// })





var main = document.querySelector('#main')
var cursor = document.querySelector("#cursor")

main.addEventListener("mousemove", function(elem){
    cursor.style.left = elem.x+"px"
    cursor.style.top = elem.y+"px"
    
})
