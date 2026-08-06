
// var aud = new Audio('./31.mp3')
// console.log('hi');

// document.body.addEventListener("keypress",(elem)=>{
//     if(elem.code =='KeyD'){
//         console.log("hi");
        
//     }
// })



// var head = document.querySelectorAll('h1')

// head.forEach((elem)=>{
//     console.log(elem);
    
//     console.log("Hello Guys!!!");
// })

// we can't use map , filter, reduce with head.




// var outer = document.querySelector("#outer");

// outer.childNodes[0].textContent = 'lalala'
// // outer.childNodes[0].innerHTML = 'lalala' // this doesnot work

// console.log(outer.childNodes[0].textContent); // lalala
// console.log(outer.childNodes[0]);
// console.log(outer.childNodes[1]); // div#inner1
// console.log(outer.childNodes[2]); // #text
// console.log(outer.childNodes[3]); // div#inner2


// outer.style.backgroundColor = 'red'
// console.log(outer.childNodes);
// childNodes is a DOM property in JavaScript that returns a live NodeList of all child nodes of a given element, meaning it includes everything inside the element, not just HTML tags; this consists of element nodes (like <div>, <p>), text nodes (which include actual text as well as spaces, tabs, and line breaks created by formatting in the HTML), and comment nodes (<!-- comment -->), and because browsers treat whitespace as text, even an empty-looking gap between elements becomes a text node, which is why childNodes.length is often larger than expected; the returned NodeList is ordered exactly as the nodes appear in the DOM, can be accessed using index values like childNodes[0], and updates automatically if the DOM changes, but it is not a true array, so array methods like map() or forEach() may not work directly in all environments; due to the inclusion of non-element nodes, childNodes is mainly useful when you need full DOM-level control or precise traversal, whereas for most UI-related tasks where only HTML elements are needed, developers typically prefer using element.children instead.




// ================================


var allElem= document.querySelectorAll('.elem');


allElem.forEach((elem)=>{
    // console.log(elem.innerHTML);
    console.log(elem.childNodes);
    
    
})