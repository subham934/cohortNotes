// var h1 = React.createElement("h1", { id: "hero" }, "hello from India");
// var h2 = React.createElement("h2", { className: "japan" }, "hello from Japan");

// var div = React.createElement("div", { id: "parent", className: "elem" }, [
//   h1,
//   h2,
// ]);

// var root = ReactDOM.createRoot(document.querySelector("#container"));
// root.render(div);

// function h1() {
//   return React.createElement("h1", { id: "hero" }, "Kuch bhi bol do");
// }

// const h1=()=> {
//   return React.createElement("h1", { id: "hero" }, "Kuch bhi bol do");
// }
// var root = ReactDOM.createRoot(document.querySelector("#container"));
// root.render(h1());


import box from "./app.js";
import circle from "./test.js";
var root = ReactDOM.createRoot(document.querySelector("#container"));

const parent  = React.createElement("div", { id: "parent", className: "elem" }, 
  box(), circle()
);


root.render(parent);