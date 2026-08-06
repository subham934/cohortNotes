let num = document.getElementById("num");
let dec = document.getElementById("dec");
let inc = document.getElementById("inc");

let sum = 0;

inc.addEventListener("click", () => {
  sum++;
  num.innerHTML = sum;
});

dec.addEventListener("click", () => {
  if (sum > 0) {
    sum--;
    num.innerHTML = sum;
  }
});
